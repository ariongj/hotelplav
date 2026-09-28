/*
 * Dependency-free WebGL equirectangular (360°) panorama renderer — a port of
 * design/pano-view.js. The React wrapper (PanoViewer.tsx) owns the DOM; this
 * class owns WebGL, input and the animation loop.
 */

export type PanoScene = {
  src: string;
  yaw?: number;
  pitch?: number;
  /** Vertical field of view, degrees (28–95). */
  fov?: number;
  label?: string;
};

export type PanoView = {
  yaw: number;
  pitch: number;
  fov: number;
  /** Viewer size in CSS px. */
  w: number;
  h: number;
  ready: boolean;
};

export type PanoElements = {
  host: HTMLElement;
  wrap: HTMLElement;
  canvas: HTMLCanvasElement;
  snap: HTMLImageElement;
  label: HTMLElement;
  hint: HTMLElement;
  loader: HTMLElement;
  error: HTMLElement;
};

const VS = "attribute vec2 p;varying vec2 v;void main(){v=p;gl_Position=vec4(p,0.,1.);}";
const FS =
  "precision mediump float;varying vec2 v;uniform sampler2D t;uniform float yw,pt,tf,ar;" +
  "void main(){vec3 d=normalize(vec3(v.x*tf*ar,v.y*tf,-1.));" +
  "float cp=cos(pt),sp=sin(pt);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);" +
  "float cy=cos(yw),sy=sin(yw);d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);" +
  "float lon=atan(d.x,-d.z),lat=asin(clamp(d.y,-1.,1.));" +
  "gl_FragColor=texture2D(t,vec2(fract(lon*0.15915494+0.5),clamp(0.5-lat*0.31830988,0.002,0.998)));}";

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const FOV_MIN = 28;
const FOV_MAX = 95;
const PITCH_LIMIT = 72;

type Uniforms = { yw: WebGLUniformLocation | null; pt: WebGLUniformLocation | null; tf: WebGLUniformLocation | null; ar: WebGLUniformLocation | null };

export class PanoEngine {
  private el: PanoElements;
  private gl: WebGLRenderingContext | null = null;
  private u: Uniforms | null = null;
  private tex: WebGLTexture | null = null;

  private yaw = 0;
  private pitch = 0;
  private fov = 55;
  private fovTarget = 55;
  private baseFov = 55;
  private vy = 0;
  private vp = 0;
  private rotate = 1.6;
  private lastAct = 0;
  private visible = true;
  private ready = false;
  private everLoaded = false;
  private src = "";
  private pointers = new Map<number, { x: number; y: number }>();
  private pinch: { d: number; f: number } | null = null;
  private lastTap = 0;

  private raf = 0;
  private t0 = 0;
  private lookTimer: ReturnType<typeof setInterval> | undefined;
  private hintTimer: ReturnType<typeof setTimeout> | undefined;
  private ro: ResizeObserver | null = null;
  private io: IntersectionObserver | null = null;
  private cleanups: Array<() => void> = [];

  /** Called after every rendered frame (e.g. to position hotspots). */
  onFrame: ((view: PanoView) => void) | null = null;

  constructor(elements: PanoElements, scene: PanoScene, autorotate: number) {
    this.el = elements;
    this.initGL();
    this.bind();
    this.setAutorotate(autorotate);
    if (scene.fov) this.fov = this.fovTarget = this.baseFov = clamp(scene.fov, FOV_MIN, FOV_MAX);
    this.yaw = scene.yaw ?? 0;
    this.pitch = clamp(scene.pitch ?? 0, -PITCH_LIMIT, PITCH_LIMIT);
    if (scene.label != null) this.el.label.textContent = scene.label;
    if (scene.src) this.load(scene.src);
    this.raf = requestAnimationFrame(this.tick);
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    clearInterval(this.lookTimer);
    clearTimeout(this.hintTimer);
    this.ro?.disconnect();
    this.io?.disconnect();
    this.cleanups.forEach((fn) => fn());
    this.cleanups = [];
    this.src = "";
  }

  /** Degrees per second; 0 disables. Always off for prefers-reduced-motion. */
  setAutorotate(degPerSecond: number) {
    const reduce = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.rotate = reduce ? 0 : clamp(degPerSecond || 0, 0, 8);
  }

  get view(): PanoView {
    return {
      yaw: this.yaw,
      pitch: this.pitch,
      fov: this.fov,
      w: this.el.host.clientWidth,
      h: this.el.host.clientHeight,
      ready: this.ready,
    };
  }

  zoomBy(deltaFov: number) {
    this.fovTarget = clamp(this.fovTarget + deltaFov, FOV_MIN, 85);
    this.poke();
  }

  toggleFullscreen() {
    if (document.fullscreenElement === this.el.host) void document.exitFullscreen?.();
    else void this.el.host.requestFullscreen?.();
  }

  /** Ease the camera toward a direction (degrees). */
  lookAt(target: { yaw?: number; pitch?: number; fov?: number }) {
    const steps = 26;
    let i = 0;
    const y0 = this.yaw;
    const p0 = this.pitch;
    const f0 = this.fovTarget;
    const dy = ((((target.yaw ?? y0) - y0) % 360) + 540) % 360 - 180;
    const dp = clamp(target.pitch ?? p0, -PITCH_LIMIT, PITCH_LIMIT) - p0;
    const df = (target.fov ? clamp(target.fov, FOV_MIN, FOV_MAX) : f0) - f0;
    clearInterval(this.lookTimer);
    this.lookTimer = setInterval(() => {
      i++;
      const t = i / steps;
      const e = 1 - Math.pow(1 - t, 3);
      this.yaw = y0 + dy * e;
      this.pitch = clamp(p0 + dp * e, -PITCH_LIMIT, PITCH_LIMIT);
      this.fovTarget = f0 + df * e;
      this.vy = 0;
      this.vp = 0;
      this.poke();
      if (i >= steps) clearInterval(this.lookTimer);
    }, 16);
  }

  setScene(scene: Partial<PanoScene>) {
    clearInterval(this.lookTimer);
    if (scene.label != null) this.el.label.textContent = scene.label;
    if (scene.yaw != null) this.yaw = scene.yaw;
    if (scene.pitch != null) this.pitch = clamp(scene.pitch, -PITCH_LIMIT, PITCH_LIMIT);
    if (scene.fov) this.fovTarget = this.baseFov = clamp(scene.fov, FOV_MIN, FOV_MAX);
    if (scene.src && scene.src !== this.src) {
      // Freeze the current frame so the swap cross-fades instead of flashing.
      if (this.everLoaded && this.gl) {
        try {
          this.render();
          this.el.snap.src = this.el.canvas.toDataURL("image/jpeg", 0.7);
          this.el.snap.style.opacity = "1";
        } catch {
          /* tainted canvas — skip the cross-fade */
        }
      }
      this.load(scene.src);
    }
  }

  /* ------------------------------------------------------------ internals */

  private poke() {
    this.lastAct = performance.now();
  }

  private initGL() {
    const canvas = this.el.canvas;
    const gl = (canvas.getContext("webgl", { antialias: true, alpha: false }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(program);
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {
      yw: gl.getUniformLocation(program, "yw"),
      pt: gl.getUniformLocation(program, "pt"),
      tf: gl.getUniformLocation(program, "tf"),
      ar: gl.getUniformLocation(program, "ar"),
    };
    this.tex = gl.createTexture();
    this.gl = gl;
  }

  private listen<K extends keyof HTMLElementEventMap>(
    target: HTMLElement | Document,
    type: K,
    handler: (e: HTMLElementEventMap[K]) => void,
    options?: AddEventListenerOptions,
  ) {
    target.addEventListener(type, handler as EventListener, options);
    this.cleanups.push(() => target.removeEventListener(type, handler as EventListener, options));
  }

  private bind() {
    const { wrap, host, hint } = this.el;
    if (typeof ResizeObserver !== "undefined") {
      this.ro = new ResizeObserver(() => this.size());
      this.ro.observe(host);
    }
    if (typeof IntersectionObserver !== "undefined") {
      this.io = new IntersectionObserver((entries) => {
        this.visible = !!entries[0]?.isIntersecting;
      });
      this.io.observe(host);
    }
    this.listen(document, "fullscreenchange", () => this.size());

    this.listen(wrap, "pointerdown", (e) => {
      if ((e.target as HTMLElement).closest("button, a")) return;
      wrap.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this.pointers.size === 2) {
        const [a, b] = Array.from(this.pointers.values());
        this.pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), f: this.fovTarget };
      }
      // Double-tap to zoom on touch screens (dblclick is unreliable there).
      if (e.pointerType === "touch" && this.pointers.size === 1) {
        const now = performance.now();
        if (now - this.lastTap < 300) this.toggleZoom();
        this.lastTap = now;
      }
      this.vy = 0;
      this.vp = 0;
      this.poke();
      wrap.style.cursor = "grabbing";
      hint.style.opacity = "0";
    });

    this.listen(wrap, "pointermove", (e) => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;
      if (this.pointers.size === 2 && this.pinch) {
        const [a, b] = Array.from(this.pointers.values());
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > 20) this.fovTarget = clamp((this.pinch.f * this.pinch.d) / d, FOV_MIN, FOV_MAX);
      } else if (this.pointers.size === 1) {
        const k = this.fov / Math.max(200, wrap.clientHeight);
        this.yaw -= dx * k;
        this.pitch = clamp(this.pitch + dy * k, -PITCH_LIMIT, PITCH_LIMIT);
        this.vy = this.vy * 0.75 - dx * k * 0.25 * 60;
        this.vp = this.vp * 0.75 + dy * k * 0.25 * 60;
      }
      this.poke();
    });

    const up = (e: PointerEvent) => {
      this.pointers.delete(e.pointerId);
      this.pinch = null;
      if (!this.pointers.size) wrap.style.cursor = "grab";
      this.poke();
    };
    this.listen(wrap, "pointerup", up);
    this.listen(wrap, "pointercancel", up);

    this.listen(wrap, "dblclick", (e) => {
      if ((e.target as HTMLElement).closest("button, a")) return;
      this.toggleZoom();
    });

    // Plain wheel scrolls the page; ctrl/pinch-zoom or fullscreen zooms the view.
    this.listen(
      wrap,
      "wheel",
      (e) => {
        if (document.fullscreenElement === host || e.ctrlKey) {
          e.preventDefault();
          this.fovTarget = clamp(this.fovTarget * (1 + e.deltaY * 0.0014), FOV_MIN, FOV_MAX);
          this.poke();
        }
      },
      { passive: false },
    );

    this.hintTimer = setTimeout(() => {
      if (!this.lastAct) hint.style.opacity = "0";
    }, 7000);
  }

  private toggleZoom() {
    this.fovTarget =
      this.fovTarget > this.baseFov - 10 ? clamp(this.baseFov - 20, FOV_MIN, FOV_MAX) : this.baseFov;
    this.poke();
  }

  private size() {
    const dpr = clamp(window.devicePixelRatio || 1, 1, 1.75);
    const { host, canvas } = this.el;
    const cw = Math.max(1, Math.round(host.clientWidth * dpr));
    const ch = Math.max(1, Math.round(host.clientHeight * dpr));
    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
      this.gl?.viewport(0, 0, cw, ch);
    }
  }

  private load(src: string) {
    const { loader, error, snap, wrap } = this.el;
    this.src = src;
    if (!this.everLoaded) {
      loader.style.opacity = "1";
      loader.style.display = "flex";
    }
    error.style.display = "none";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (this.src !== src) return;
      const gl = this.gl;
      if (!gl) {
        wrap.style.background = `#0d0904 url(${JSON.stringify(src)}) center/cover no-repeat`;
      } else {
        let source: TexImageSource = img;
        const max = (gl.getParameter(gl.MAX_TEXTURE_SIZE) as number) || 4096;
        if (img.width > max) {
          const c = document.createElement("canvas");
          c.width = max;
          c.height = Math.round((img.height * max) / img.width);
          c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
          source = c;
        }
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      this.ready = true;
      this.everLoaded = true;
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 550);
      this.render();
      snap.style.opacity = "0";
    };
    img.onerror = () => {
      if (this.src !== src) return;
      loader.style.opacity = "0";
      loader.style.display = "none";
      snap.style.opacity = "0";
      error.style.display = "block";
    };
    img.src = src;
  }

  private render() {
    const gl = this.gl;
    if (!gl || !this.ready || !this.u) return;
    this.size();
    const d2r = Math.PI / 180;
    gl.uniform1f(this.u.yw, -this.yaw * d2r);
    gl.uniform1f(this.u.pt, this.pitch * d2r);
    gl.uniform1f(this.u.tf, Math.tan((this.fov * d2r) / 2));
    gl.uniform1f(this.u.ar, this.el.canvas.width / Math.max(1, this.el.canvas.height));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  private tick = (now: number) => {
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(0.05, (now - (this.t0 || now)) / 1000);
    this.t0 = now;
    if (!this.visible || (!this.ready && this.gl)) return;
    if (!this.pointers.size) {
      this.yaw += this.vy * dt;
      this.pitch = clamp(this.pitch + this.vp * dt, -PITCH_LIMIT, PITCH_LIMIT);
      const decay = Math.pow(0.05, dt);
      this.vy *= decay;
      this.vp *= decay;
      if (this.rotate && now - this.lastAct > 3500) this.yaw += this.rotate * dt;
    }
    this.fov += (this.fovTarget - this.fov) * Math.min(1, dt * 8);
    this.render();
    this.onFrame?.(this.view);
  };
}

/**
 * Where a panorama direction (yaw/pitch, degrees) lands in the current view.
 * Returns percentages of the viewer box, or null when it is behind the
 * camera or off-screen. `opacity` fades hotspots near the edges.
 */
export function projectToView(
  view: PanoView,
  yaw: number,
  pitch: number,
): { x: number; y: number; opacity: number } | null {
  if (!view.ready || !view.w || !view.h) return null;
  const d2r = Math.PI / 180;
  const tf = Math.tan((view.fov * d2r) / 2);
  const ar = view.w / view.h;
  const yw = -view.yaw * d2r;
  const pt = view.pitch * d2r;
  const cyw = Math.cos(yw);
  const syw = Math.sin(yw);
  const cp = Math.cos(pt);
  const sp = Math.sin(pt);
  const lon = yaw * d2r;
  const lat = pitch * d2r;
  const cl = Math.cos(lat);
  const x2 = Math.sin(lon) * cl;
  const y2 = Math.sin(lat);
  const z2 = -Math.cos(lon) * cl;
  const x1 = x2 * cyw - z2 * syw;
  const z1 = x2 * syw + z2 * cyw;
  const y0 = y2 * cp + z1 * sp;
  const z0 = -y2 * sp + z1 * cp;
  if (z0 > -0.05) return null;
  const vx = x1 / -z0 / (tf * ar);
  const vy = y0 / -z0 / tf;
  const edge = Math.max(Math.abs(vx), Math.abs(vy));
  if (edge > 1.02) return null;
  return {
    x: ((vx + 1) / 2) * 100,
    y: ((1 - vy) / 2) * 100,
    opacity: edge > 0.84 ? 1 - (edge - 0.84) / 0.2 : 1,
  };
}
