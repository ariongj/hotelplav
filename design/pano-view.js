/* <pano-view> — dependency-free WebGL 360° (equirectangular) panorama viewer.
   Attributes: src, yaw, pitch, fov (vertical, deg), autorotate (deg/s or "off"), label.
   API: el.setScene({src, yaw, pitch, fov, label}) */
(function () {
  'use strict';
  if (window.customElements && customElements.get('pano-view')) return;

  var VS = 'attribute vec2 p;varying vec2 v;void main(){v=p;gl_Position=vec4(p,0.,1.);}';
  var FS = 'precision mediump float;varying vec2 v;uniform sampler2D t;uniform float yw,pt,tf,ar;' +
    'void main(){vec3 d=normalize(vec3(v.x*tf*ar,v.y*tf,-1.));' +
    'float cp=cos(pt),sp=sin(pt);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);' +
    'float cy=cos(yw),sy=sin(yw);d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);' +
    'float lon=atan(d.x,-d.z),lat=asin(clamp(d.y,-1.,1.));' +
    'gl_FragColor=texture2D(t,vec2(fract(lon*0.15915494+0.5),clamp(0.5-lat*0.31830988,0.002,0.998)));}';

  function mk(tag, css, html) { var n = document.createElement(tag); if (css) n.style.cssText = css; if (html != null) n.innerHTML = html; return n; }
  var clamp = function (x, a, b) { return Math.max(a, Math.min(b, x)); };

  class PanoView extends HTMLElement {
    static get observedAttributes() { return ['src', 'yaw', 'pitch', 'fov', 'autorotate', 'label']; }
    constructor() {
      super();
      this._yaw = 0; this._pitch = 0; this._fov = 55; this._fovT = 55; this._baseFov = 55;
      this._vy = 0; this._vp = 0; this._rot = 1.6; this._lastAct = 0; this._visible = true;
      this._src = ''; this._ptrs = new Map(); this._ever = false;
    }
    connectedCallback() {
      if (this._built) return; this._built = true;
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>:host{display:block;position:relative}@keyframes pvspin{to{transform:rotate(360deg)}}</style>';
      var w = this._wrap = mk('div', 'position:absolute;inset:0;overflow:hidden;background:#0d0904;user-select:none;-webkit-user-select:none;touch-action:none;cursor:grab;font-family:Jost,system-ui,sans-serif');
      root.appendChild(w);
      this._canvas = mk('canvas', 'position:absolute;inset:0;width:100%;height:100%;display:block'); w.appendChild(this._canvas);
      this._snap = mk('img', 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .8s ease;pointer-events:none'); w.appendChild(this._snap);
      var chip = mk('div', 'position:absolute;top:14px;left:14px;display:flex;align-items:center;gap:9px;pointer-events:none');
      chip.innerHTML = '<span style="background:#B08E55;color:#231a10;font:600 10px/1 Jost,sans-serif;letter-spacing:.14em;padding:7px 9px;border-radius:2px">360&deg;</span>';
      this._label = mk('span', 'color:#F7F1E7;font:500 11px/1.4 Jost,sans-serif;letter-spacing:.16em;text-transform:uppercase;text-shadow:0 1px 10px rgba(0,0,0,.7)');
      chip.appendChild(this._label); w.appendChild(chip);
      this._hint = mk('div', 'position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:rgba(13,9,4,.55);backdrop-filter:blur(6px);color:rgba(247,241,231,.9);font:500 11px/1 Jost,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:10px 16px;border-radius:30px;pointer-events:none;transition:opacity .6s;white-space:nowrap', 'Drag to look around');
      w.appendChild(this._hint);
      var bar = mk('div', 'position:absolute;right:12px;bottom:12px;display:flex;gap:8px');
      var bs = 'width:34px;height:34px;display:flex;align-items:center;justify-content:center;background:rgba(13,9,4,.55);backdrop-filter:blur(6px);border:1px solid rgba(247,241,231,.22);border-radius:2px;color:#F7F1E7;cursor:pointer;font:400 17px/1 Jost,sans-serif;padding:0';
      var self = this;
      var bMinus = mk('button', bs, '&minus;'), bPlus = mk('button', bs, '+');
      var bFs = mk('button', bs, '<svg width="13" height="13" viewBox="0 0 14 14"><path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" fill="none" stroke-width="1.6"></path></svg>');
      bMinus.title = 'Zoom out'; bPlus.title = 'Zoom in'; bFs.title = 'Fullscreen';
      bMinus.addEventListener('click', function () { self._fovT = clamp(self._fovT + 12, 28, 85); self._poke(); });
      bPlus.addEventListener('click', function () { self._fovT = clamp(self._fovT - 12, 28, 85); self._poke(); });
      bFs.addEventListener('click', function () {
        if (document.fullscreenElement === self) { document.exitFullscreen && document.exitFullscreen(); }
        else if (self.requestFullscreen) { self.requestFullscreen(); }
      });
      bar.appendChild(bMinus); bar.appendChild(bPlus); bar.appendChild(bFs); w.appendChild(bar);
      this._loader = mk('div', 'position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#0d0904;transition:opacity .5s;pointer-events:none');
      this._loader.innerHTML = '<div style="width:38px;height:38px;border-radius:50%;border:2px solid rgba(176,142,85,.25);border-top-color:#B08E55;animation:pvspin 1s linear infinite"></div><div style="color:rgba(247,241,231,.6);font:500 10px/1 Jost,sans-serif;letter-spacing:.24em;text-transform:uppercase">Loading 360&deg; view</div>';
      w.appendChild(this._loader);
      this._err = mk('div', 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:none;background:rgba(13,9,4,.8);color:#E9D9BC;font:400 13px/1.5 Jost,sans-serif;padding:12px 18px;border-radius:2px', 'Couldn&rsquo;t load this panorama');
      w.appendChild(this._err);

      this._initGL();
      this._bind();
      // initial attrs
      this._rot = this._parseRot(this.getAttribute('autorotate'));
      if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) this._rot = 0;
      this._label.textContent = this.getAttribute('label') || '';
      var f = parseFloat(this.getAttribute('fov')); if (f) { this._fov = this._fovT = this._baseFov = clamp(f, 28, 95); }
      this._yaw = parseFloat(this.getAttribute('yaw')) || 0;
      this._pitch = clamp(parseFloat(this.getAttribute('pitch')) || 0, -72, 72);
      var src = this.getAttribute('src'); if (src) this._load(src);
      this._raf = requestAnimationFrame(this._tick.bind(this));
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
    }
    attributeChangedCallback(n, o, v) {
      if (!this._built || o === v) return;
      if (n === 'src' && v && v !== this._src) this.setScene({ src: v });
      else if (n === 'label') this._label.textContent = v || '';
      else if (n === 'autorotate') this._rot = this._parseRot(v);
      else if (n === 'yaw') this._yaw = parseFloat(v) || 0;
      else if (n === 'pitch') this._pitch = clamp(parseFloat(v) || 0, -72, 72);
      else if (n === 'fov') { var f = parseFloat(v); if (f) this._fovT = this._baseFov = clamp(f, 28, 95); }
    }
    _parseRot(v) {
      if (v == null || v === '') return 1.6;
      if (v === 'off' || v === 'false' || v === '0') return 0;
      var f = parseFloat(v); return isNaN(f) ? 1.6 : clamp(f, 0, 8);
    }
    _poke() { this._lastAct = performance.now(); }
    _initGL() {
      var gl = this._gl = this._canvas.getContext('webgl', { antialias: true, alpha: false }) || this._canvas.getContext('experimental-webgl');
      if (!gl) { this._noGL = true; return; }
      function sh(type, srcc) { var s = gl.createShader(type); gl.shaderSource(s, srcc); gl.compileShader(s); return s; }
      var pr = this._pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr); gl.useProgram(pr);
      var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      var loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      this._u = { yw: gl.getUniformLocation(pr, 'yw'), pt: gl.getUniformLocation(pr, 'pt'), tf: gl.getUniformLocation(pr, 'tf'), ar: gl.getUniformLocation(pr, 'ar') };
      this._tex = gl.createTexture();
    }
    _bind() {
      var w = this._wrap, self = this;
      if (window.ResizeObserver) { this._ro = new ResizeObserver(function () { self._size(); }); this._ro.observe(this); }
      if (window.IntersectionObserver) { this._io = new IntersectionObserver(function (e) { self._visible = !!(e[0] && e[0].isIntersecting); }); this._io.observe(this); }
      document.addEventListener('fullscreenchange', function () { self._size(); });
      w.addEventListener('pointerdown', function (e) {
        w.setPointerCapture(e.pointerId);
        self._ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (self._ptrs.size === 2) {
          var p = Array.from(self._ptrs.values());
          self._pinch = { d: Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y), f: self._fovT };
        }
        self._vy = 0; self._vp = 0; self._poke(); w.style.cursor = 'grabbing';
        self._hint.style.opacity = '0';
      });
      w.addEventListener('pointermove', function (e) {
        var p = self._ptrs.get(e.pointerId); if (!p) return;
        var dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
        if (self._ptrs.size === 2 && self._pinch) {
          var a = Array.from(self._ptrs.values());
          var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (d > 20) self._fovT = clamp(self._pinch.f * self._pinch.d / d, 28, 95);
        } else if (self._ptrs.size === 1) {
          var k = self._fov / Math.max(200, self._wrap.clientHeight);
          self._yaw -= dx * k; self._pitch = clamp(self._pitch + dy * k, -72, 72);
          self._vy = self._vy * 0.75 - dx * k * 0.25 * 60; self._vp = self._vp * 0.75 + dy * k * 0.25 * 60;
        }
        self._poke();
      });
      function up(e) {
        self._ptrs.delete(e.pointerId); self._pinch = null;
        if (!self._ptrs.size) w.style.cursor = 'grab';
        self._poke();
      }
      w.addEventListener('pointerup', up); w.addEventListener('pointercancel', up);
      w.addEventListener('dblclick', function () {
        self._fovT = (self._fovT > self._baseFov - 10) ? clamp(self._baseFov - 20, 28, 95) : self._baseFov;
        self._poke();
      });
      w.addEventListener('wheel', function (e) {
        if (document.fullscreenElement === self || e.ctrlKey) {
          e.preventDefault();
          self._fovT = clamp(self._fovT * (1 + e.deltaY * 0.0014), 28, 95);
          self._poke();
        }
      }, { passive: false });
      setTimeout(function () { if (!self._lastAct) self._hint.style.opacity = '0'; }, 7000);
    }
    _size() {
      var dpr = clamp(window.devicePixelRatio || 1, 1, 1.75);
      var cw = Math.max(1, Math.round(this.clientWidth * dpr)), ch = Math.max(1, Math.round(this.clientHeight * dpr));
      if (this._canvas.width !== cw || this._canvas.height !== ch) { this._canvas.width = cw; this._canvas.height = ch; if (this._gl) this._gl.viewport(0, 0, cw, ch); }
    }
    get view() {
      return { yaw: this._yaw, pitch: this._pitch, fov: this._fov, w: this.clientWidth, h: this.clientHeight, ready: !!this._ready };
    }
    /* Ease the camera toward a yaw/pitch (degrees). Used for hotspot focus. */
    lookAt(o) {
      o = o || {};
      var self = this, steps = 26, i = 0;
      var y0 = this._yaw, p0 = this._pitch, f0 = this._fovT;
      var dy = ((((o.yaw != null ? o.yaw : y0) - y0) % 360) + 540) % 360 - 180;
      var dp = clamp(o.pitch != null ? o.pitch : p0, -72, 72) - p0;
      var df = (o.fov ? clamp(o.fov, 28, 95) : f0) - f0;
      clearInterval(this._lookIv);
      this._lookIv = setInterval(function () {
        i++;
        var t = i / steps, e = 1 - Math.pow(1 - t, 3);
        self._yaw = y0 + dy * e; self._pitch = clamp(p0 + dp * e, -72, 72); self._fovT = f0 + df * e;
        self._vy = 0; self._vp = 0; self._poke();
        if (i >= steps) clearInterval(self._lookIv);
      }, 16);
    }
    setScene(o) {
      o = o || {};
      clearInterval(this._lookIv);
      if (o.label != null) this._label.textContent = o.label;
      if (o.yaw != null) this._yaw = o.yaw;
      if (o.pitch != null) this._pitch = clamp(o.pitch, -72, 72);
      if (o.fov) { this._fovT = this._baseFov = clamp(o.fov, 28, 95); }
      if (o.src && o.src !== this._src) {
        if (this._ever && this._gl) {
          try { this._render(); this._snap.src = this._canvas.toDataURL('image/jpeg', 0.7); this._snap.style.opacity = '1'; } catch (e) {}
        }
        this._load(o.src);
      }
    }
    _load(src) {
      var self = this; this._src = src;
      if (!this._ever) { this._loader.style.opacity = '1'; this._loader.style.display = 'flex'; }
      this._err.style.display = 'none';
      var img = new Image(); img.crossOrigin = 'anonymous';
      img.onload = function () {
        if (self._src !== src) return;
        if (self._noGL) { self._wrap.style.background = '#0d0904 url(' + JSON.stringify(src) + ') center/cover no-repeat'; }
        else {
          var gl = self._gl, source = img;
          var max = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
          if (img.width > max) {
            var c = document.createElement('canvas'); c.width = max; c.height = Math.round(img.height * max / img.width);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); source = c;
          }
          gl.bindTexture(gl.TEXTURE_2D, self._tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        self._ready = true; self._ever = true;
        self._loader.style.opacity = '0';
        setTimeout(function () { self._loader.style.display = 'none'; }, 550);
        self._render();
        self._snap.style.opacity = '0';
      };
      img.onerror = function () {
        if (self._src !== src) return;
        self._loader.style.opacity = '0'; self._loader.style.display = 'none';
        self._snap.style.opacity = '0'; self._err.style.display = 'block';
      };
      img.src = src;
    }
    _render() {
      var gl = this._gl; if (!gl || !this._ready) return;
      this._size();
      var d2r = Math.PI / 180;
      gl.uniform1f(this._u.yw, -this._yaw * d2r);
      gl.uniform1f(this._u.pt, this._pitch * d2r);
      gl.uniform1f(this._u.tf, Math.tan(this._fov * d2r / 2));
      gl.uniform1f(this._u.ar, this._canvas.width / Math.max(1, this._canvas.height));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    _tick(now) {
      this._raf = requestAnimationFrame(this._tick.bind(this));
      var dt = Math.min(0.05, (now - (this._t0 || now)) / 1000); this._t0 = now;
      if (!this._visible || (!this._ready && !this._noGL)) return;
      if (!this._ptrs.size) {
        this._yaw += this._vy * dt; this._pitch = clamp(this._pitch + this._vp * dt, -72, 72);
        var dec = Math.pow(0.05, dt); this._vy *= dec; this._vp *= dec;
        if (this._rot && now - this._lastAct > 3500) this._yaw += this._rot * dt;
      }
      this._fov += (this._fovT - this._fov) * Math.min(1, dt * 8);
      this._render();
    }
  }
  customElements.define('pano-view', PanoView);
})();
