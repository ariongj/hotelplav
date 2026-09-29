/*
 * Illustrative 3D map of the resort: a procedural valley with the hotel,
 * spa, terrace, chapel, lake and a trail to a ridge viewpoint, rendered with three.js. The React
 * wrapper (ResortMap.tsx) loads this module on demand and owns the overlay
 * UI; this class owns WebGL, the camera and the animation loop.
 */

import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Fog,
  Group,
  HemisphereLight,
  InstancedMesh,
  Line,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  Quaternion,
  Scene,
  ShaderMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import type { PoiId } from "./pois";
import { fbm, heightAt, isReserved, LAKE, lakeDistance, PADS, padLevel, random, WATER_LEVEL, WORLD_SIZE } from "./terrain";

export type ViewId = PoiId | "overview" | "hero";
type Vec3 = [number, number, number];
type CameraView = { position: Vec3; target: Vec3 };

/** Screen position of a place marker, in % of the viewport. */
export type PinPosition = { id: PoiId; x: number; y: number; visible: boolean };

export type ResortEngineOptions = {
  reducedMotion: boolean;
  /** false: no dragging or zooming (the home hero) — the camera drifts on its own and the page scrolls freely. */
  interactive?: boolean;
  /** Where the camera starts. */
  initialView?: ViewId;
  /** Called after every rendered frame with the marker positions. */
  onPins?: (pins: PinPosition[]) => void;
  /** The visitor started dragging or zooming. */
  onInteract?: () => void;
};

const SKY_TOP = "#8db1c8";
const SKY_HORIZON = "#e6eeef";
const SKY_BOTTOM = "#d6e2e3";

/** Months (0 = January) when snow falls on the map. */
const SNOW_MONTHS = [10, 11, 0, 1, 2];

const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------------ layout */

const hotelY = padLevel(PADS.hotel);
const chapelY = padLevel(PADS.chapel);
const TRAIL_FROM = new Vector3(PADS.trailHead.x, padLevel(PADS.trailHead), PADS.trailHead.z);
const TRAIL_TO = new Vector3(PADS.viewpoint.x, padLevel(PADS.viewpoint), PADS.viewpoint.z);

/** Switchback footpath from the hotel grounds up through the forest to the ridge viewpoint. */
const TRAIL = (() => {
  const across = new Vector3().subVectors(TRAIL_TO, TRAIL_FROM).setY(0);
  across.set(-across.z, 0, across.x).normalize();
  const bends = 6;
  const points: Vector3[] = [];
  for (let i = 0; i <= bends; i++) {
    const swing = i === 0 || i === bends ? 0 : (i % 2 ? 1 : -1) * 7;
    points.push(new Vector3().lerpVectors(TRAIL_FROM, TRAIL_TO, i / bends).addScaledVector(across, swing).setY(0));
  }
  return new CatmullRomCurve3(points);
})();
const TRAIL_SAMPLES = TRAIL.getSpacedPoints(80);

/** The approach road along the near shore to the hotel forecourt. */
const ROAD = new CatmullRomCurve3(
  [
    [132, 16],
    [100, 12],
    [70, 16],
    [48, 14],
    [32, 9],
    [22, 6],
  ].map(([x, z]) => new Vector3(x, 0, z)),
);
const ROAD_SAMPLES = ROAD.getSpacedPoints(90);

/** Marker anchors (world space). */
const ANCHORS: Record<PoiId, Vector3> = {
  arrival: new Vector3(6, hotelY + 17, -12.5),
  rooms: new Vector3(29, hotelY + 11.5, -11),
  spa: new Vector3(-13, hotelY + 7.5, -9),
  dining: new Vector3(6, hotelY + 3.2, -1.5),
  chapel: new Vector3(-38, chapelY + 17, -14.5),
  lake: new Vector3(LAKE.x, WATER_LEVEL + 2.5, LAKE.z),
  ski: TRAIL_TO.clone().setY(TRAIL_TO.y + 7),
};

const VIEWS: Record<ViewId, CameraView> = {
  overview: { position: [74, 58, 160], target: [2, 18, -22] },
  // Home hero: across the lake to the hotel, peaks behind.
  hero: { position: [62, 26, 132], target: [-40, 22, -20] },
  arrival: { position: [24, hotelY + 24, 54], target: [6, hotelY + 6, -10] },
  rooms: { position: [64, hotelY + 20, 22], target: [29, hotelY + 4, -11] },
  spa: { position: [-42, hotelY + 15, 24], target: [-13, hotelY + 2, -6] },
  dining: { position: [-12, hotelY + 11, 38], target: [6, hotelY + 3, -3] },
  chapel: { position: [-68, chapelY + 20, 12], target: [-38, chapelY + 5, -20] },
  lake: { position: [-46, 22, 100], target: [LAKE.x, WATER_LEVEL + 2, LAKE.z - 6] },
  // From low across the slope: the trail climbs from the hotel to the ridge viewpoint.
  ski: { position: [96, 52, 62], target: [60, 26, -62] },
};

/* --------------------------------------------------------------- materials */

function facadeTexture(cols: number, rows: number, seed: number, lit: boolean): CanvasTexture {
  const cw = 18;
  const rh = 24;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, cols) * cw;
  canvas.height = rows * rh;
  const ctx = canvas.getContext("2d")!;
  const rand = random(seed);
  ctx.fillStyle = lit ? "#000000" : "#e7e1d5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const on = rand() < 0.42;
      if (lit) {
        if (!on) continue;
        ctx.fillStyle = rand() < 0.5 ? "#ffcf87" : "#ffbf6e";
      } else {
        ctx.fillStyle = on ? "#efcf98" : "#2f3a3c";
      }
      ctx.fillRect(c * cw + 5, r * rh + 5, cw - 10, rh - 9);
    }
  }
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function facadeMaterial(width: number, rows: number, seed: number): MeshStandardMaterial {
  const cols = Math.max(1, Math.round(width / 2.4));
  return new MeshStandardMaterial({
    map: facadeTexture(cols, rows, seed, false),
    emissiveMap: facadeTexture(cols, rows, seed, true),
    emissive: new Color("#ffb766"),
    emissiveIntensity: 0.85,
    roughness: 0.85,
  });
}

const stone = () => new MeshStandardMaterial({ color: "#e7e1d5", roughness: 0.9 });

/* ---------------------------------------------------------------- geometry */

/** Triangular prism with its ridge along x, sitting on y = 0. */
function gableRoofGeometry(width: number, depth: number, height: number): BufferGeometry {
  const shape = new Shape();
  shape.moveTo(-depth / 2, 0);
  shape.lineTo(depth / 2, 0);
  shape.lineTo(0, height);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: width, bevelEnabled: false });
  geometry.rotateY(-Math.PI / 2);
  geometry.translate(width / 2, 0, 0);
  return geometry;
}

/** A flat strip laid over the terrain along a curve (the road and the footpath). */
function ribbonGeometry(curve: CatmullRomCurve3, halfWidth: number, samples: number): BufferGeometry {
  const positions: number[] = [];
  const indices: number[] = [];
  const point = new Vector3();
  const tangent = new Vector3();
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent);
    const px = -tangent.z;
    const pz = tangent.x;
    const length = Math.hypot(px, pz) || 1;
    for (const side of [-1, 1]) {
      const x = point.x + (px / length) * halfWidth * side;
      const z = point.z + (pz / length) * halfWidth * side;
      positions.push(x, heightAt(x, z) + 0.14, z);
    }
    if (i < samples) {
      const a = i * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function shadowed<T extends Object3D>(object: T): T {
  object.traverse((child) => {
    if (child instanceof Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return object;
}

/** A block with window façades and a pitched roof. */
function building(opts: {
  width: number;
  height: number;
  depth: number;
  floors: number;
  seed: number;
  roof: MeshStandardMaterial;
  roofHeight?: number;
}): Group {
  const { width, height, depth, floors, seed, roof } = opts;
  const front = facadeMaterial(width, floors, seed);
  const side = facadeMaterial(depth, floors, seed + 7);
  const plain = stone();
  const body = new Mesh(new BoxGeometry(width, height, depth), [side, side, plain, plain, front, front]);
  body.position.y = height / 2;
  const cap = new Mesh(gableRoofGeometry(width + 0.9, depth + 0.9, opts.roofHeight ?? depth * 0.32), roof);
  cap.position.y = height;
  const group = new Group();
  group.add(body, cap);
  return group;
}

/* ------------------------------------------------------------------ engine */

export class ResortEngine {
  static isSupported(): boolean {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  }

  private container: HTMLElement;
  private options: ResortEngineOptions;
  private renderer: WebGLRenderer;
  private scene = new Scene();
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private sky: Mesh;
  private snow: Points | null = null;
  private ro: ResizeObserver | null = null;
  private io: IntersectionObserver | null = null;
  private onVisibility = () => this.updateRunning();
  /**
   * A plain wheel scrolls the page, as over the 360° viewer; ctrl + wheel (and
   * trackpad pinch, which arrives as one) or fullscreen zooms. Runs in the
   * capture phase, before OrbitControls sees the event.
   */
  private onWheelCapture = (e: WheelEvent) => {
    this.controls.enableZoom = e.ctrlKey || !!document.fullscreenElement;
  };
  /** Touch pinch zooms as usual. */
  private onPointerCapture = () => {
    this.controls.enableZoom = true;
  };
  private visible = true;
  private running = false;
  private lastTime = 0;
  private lastInteract = 0;
  private tourMode = false;
  private readonly interactive: boolean;
  /** Azimuth range the idle drift swings across, and its current direction. */
  private swing: [number, number] = [-1.2, 1.2];
  private swingDir = 1;
  private flight: {
    p0: Vector3;
    p1: Vector3;
    t0: Vector3;
    t1: Vector3;
    start: number;
    duration: number;
    lift: number;
  } | null = null;
  private readonly projected = new Vector3();
  private readonly pinIds = Object.keys(ANCHORS) as PoiId[];
  private readonly compact: boolean;

  constructor(container: HTMLElement, options: ResortEngineOptions) {
    this.container = container;
    this.options = options;
    this.interactive = options.interactive ?? true;
    this.compact = window.innerWidth < 768 || (navigator.hardwareConcurrency ?? 8) <= 4;

    const renderer = new WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.compact ? 1.5 : 1.75));
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = !this.compact;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);
    this.renderer = renderer;

    this.camera = new PerspectiveCamera(40, 1, 0.5, 1600);
    this.scene.fog = new Fog(new Color(SKY_HORIZON), 230, 760);

    this.sky = this.buildSky();
    this.scene.add(this.sky);
    this.buildEnvironment();
    this.buildLights();
    this.scene.add(this.buildTerrain());
    this.scene.add(this.buildLake());
    this.scene.add(this.buildRoad());
    this.scene.add(this.buildHotel());
    this.scene.add(this.buildChapel());
    this.scene.add(this.buildTrail());
    this.scene.add(this.buildTrees());
    if (!options.reducedMotion && SNOW_MONTHS.includes(new Date().getMonth())) {
      this.snow = this.buildSnow();
      this.scene.add(this.snow);
    }

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.6;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.6;
    controls.screenSpacePanning = false;
    controls.minDistance = 20;
    controls.maxDistance = 240;
    controls.minPolarAngle = 0.18;
    controls.maxPolarAngle = 1.38;
    // Stay on the lake side: the high ground behind the hotel closes off the rest.
    controls.minAzimuthAngle = -1.35;
    controls.maxAzimuthAngle = 1.35;
    controls.enabled = this.interactive;
    controls.addEventListener("start", () => {
      this.lastInteract = performance.now();
      controls.autoRotate = false;
      this.options.onInteract?.();
    });
    controls.addEventListener("change", () => {
      const t = controls.target;
      t.x = clamp(t.x, -95, 95);
      t.z = clamp(t.z, -105, 95);
      t.y = clamp(t.y, 0, 40);
    });
    this.controls = controls;
    // OrbitControls claims every touch; the hero must let the page scroll.
    renderer.domElement.style.touchAction = this.interactive ? "none" : "pan-y";
    container.addEventListener("wheel", this.onWheelCapture, { capture: true, passive: true });
    container.addEventListener("pointerdown", this.onPointerCapture, { capture: true, passive: true });
    this.jumpTo(VIEWS[options.initialView ?? "overview"]);
    if (!this.interactive) {
      const base = controls.getAzimuthalAngle();
      this.swing = [base - 0.3, base + 0.3];
    }

    this.resize();
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.io = new IntersectionObserver((entries) => {
      this.visible = !!entries[0]?.isIntersecting;
      this.updateRunning();
    });
    this.io.observe(container);
    document.addEventListener("visibilitychange", this.onVisibility);
    this.lastInteract = performance.now();
    this.updateRunning();
  }

  /* ------------------------------------------------------------ public API */

  flyTo(id: ViewId) {
    const view = VIEWS[id];
    const p1 = new Vector3(...view.position);
    const t1 = new Vector3(...view.target);
    if (this.options.reducedMotion) {
      this.jumpTo(view);
      return;
    }
    const p0 = this.camera.position.clone();
    const t0 = this.controls.target.clone();
    const distance = p0.distanceTo(p1) + t0.distanceTo(t1);
    this.flight = {
      p0,
      p1,
      t0,
      t1,
      start: performance.now(),
      duration: clamp(900 + distance * 8, 1500, 2800),
      lift: Math.min(26, distance * 0.14),
    };
    this.controls.enabled = false;
    this.controls.autoRotate = false;
  }

  /** Scale the distance to the focus point (0.8 = closer). */
  zoomBy(factor: number) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const length = clamp(offset.length() * factor, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset.setLength(length));
    this.lastInteract = performance.now();
    this.controls.autoRotate = false;
  }

  /** Show or hide the falling snow (there is none outside the winter months). */
  setSnow(on: boolean) {
    if (this.snow) this.snow.visible = on;
  }

  /** Guided tour: keep the camera gently orbiting the current stop. */
  setTourMode(on: boolean) {
    this.tourMode = on;
    if (!on) this.lastInteract = performance.now();
  }

  dispose() {
    this.renderer.setAnimationLoop(null);
    this.ro?.disconnect();
    this.io?.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.container.removeEventListener("wheel", this.onWheelCapture, { capture: true });
    this.container.removeEventListener("pointerdown", this.onPointerCapture, { capture: true });
    this.controls.dispose();
    const textures = new Set<Texture>();
    this.scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Points || object instanceof Line) {
        object.geometry.dispose();
        const materials: Material[] = Array.isArray(object.material) ? object.material : [object.material];
        for (const material of materials) {
          for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
          material.dispose();
        }
      }
    });
    textures.forEach((texture) => texture.dispose());
    this.scene.environment?.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ------------------------------------------------------------ internals */

  private jumpTo(view: CameraView) {
    this.flight = null;
    this.camera.position.set(...view.position);
    this.controls.target.set(...view.target);
    this.controls.enabled = this.interactive;
    this.controls.update();
  }

  private updateRunning() {
    const shouldRun = this.visible && document.visibilityState === "visible";
    if (shouldRun === this.running) return;
    this.running = shouldRun;
    this.lastTime = performance.now();
    this.renderer.setAnimationLoop(shouldRun ? this.tick : null);
  }

  private resize() {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Narrow screens see less of the valley; widen the lens a little.
    this.camera.fov = width / height < 0.8 ? 52 : 40;
    this.camera.updateProjectionMatrix();
  }

  private tick = (now: number) => {
    const dt = Math.min(0.05, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const flight = this.flight;
    if (flight) {
      const t = clamp((now - flight.start) / flight.duration, 0, 1);
      const e = easeInOut(t);
      this.camera.position.lerpVectors(flight.p0, flight.p1, e);
      this.camera.position.y += Math.sin(Math.PI * e) * flight.lift;
      this.controls.target.lerpVectors(flight.t0, flight.t1, e);
      if (t >= 1) {
        this.flight = null;
        this.controls.enabled = this.interactive;
        this.lastInteract = now;
      }
    } else if (!this.options.reducedMotion) {
      if (this.tourMode || !this.interactive || now - this.lastInteract > 7000) {
        // Drift back and forth across the lake side (positive speed turns azimuth down).
        const azimuth = this.controls.getAzimuthalAngle();
        if (azimuth >= this.swing[1]) this.swingDir = 1;
        else if (azimuth <= this.swing[0]) this.swingDir = -1;
        const speed = this.tourMode ? 0.6 : this.interactive ? 0.35 : 0.5;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = speed * this.swingDir;
      }
    }
    this.controls.update(dt);

    this.sky.position.copy(this.camera.position);
    this.animateSnow(dt);

    this.renderer.render(this.scene, this.camera);
    this.emitPins();
  };

  private emitPins() {
    const onPins = this.options.onPins;
    if (!onPins) return;
    const pins: PinPosition[] = this.pinIds.map((id) => {
      const v = this.projected.copy(ANCHORS[id]).project(this.camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.04 && Math.abs(v.y) < 1.04;
      return { id, x: (v.x + 1) * 50, y: (1 - v.y) * 50, visible };
    });
    onPins(pins);
  }

  private animateSnow(dt: number) {
    const snow = this.snow;
    if (!snow?.visible) return;
    const positions = snow.geometry.attributes.position as BufferAttribute;
    const array = positions.array as Float32Array;
    const t = performance.now() / 1000;
    for (let i = 0; i < positions.count; i++) {
      const k = i * 3;
      array[k + 1] -= (2.2 + (i % 5) * 0.35) * dt;
      array[k] += Math.sin(t * 0.6 + i) * 0.6 * dt;
      if (array[k + 1] < 0) array[k + 1] += 90;
    }
    positions.needsUpdate = true;
  }

  /* ---------------------------------------------------------------- world */

  private buildSky(): Mesh {
    const material = new ShaderMaterial({
      uniforms: {
        topColor: { value: new Color(SKY_TOP) },
        horizonColor: { value: new Color(SKY_HORIZON) },
        bottomColor: { value: new Color(SKY_BOTTOM) },
      },
      vertexShader:
        "varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: `
        uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 bottomColor;
        varying vec3 vDir;
        void main() {
          float h = normalize(vDir).y;
          vec3 c = h >= 0.0
            ? mix(horizonColor, topColor, pow(clamp(h * 1.6, 0.0, 1.0), 0.7))
            : mix(horizonColor, bottomColor, pow(clamp(-h, 0.0, 1.0), 0.5));
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
      side: BackSide,
      depthWrite: false,
      fog: false,
      toneMapped: false,
    });
    const sky = new Mesh(new SphereGeometry(900, 32, 16), material);
    sky.renderOrder = -1;
    sky.frustumCulled = false;
    return sky;
  }

  /** Soft image-based light from the sky gradient, for natural reflections. */
  private buildEnvironment() {
    const envScene = new Scene();
    envScene.add(this.buildSky());
    const pmrem = new PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(envScene, 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    envScene.traverse((object) => {
      if (object instanceof Mesh) {
        object.geometry.dispose();
        (object.material as Material).dispose();
      }
    });
    pmrem.dispose();
  }

  private buildLights() {
    this.scene.add(new HemisphereLight("#e9f1f4", "#3d4a44", 0.6));
    const sun = new DirectionalLight("#fff0da", 2.5);
    sun.position.set(-150, 115, 95);
    sun.target.position.set(0, 0, -12);
    if (!this.compact) {
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const cam = sun.shadow.camera;
      cam.left = -115;
      cam.right = 115;
      cam.top = 115;
      cam.bottom = -115;
      cam.near = 20;
      cam.far = 460;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.6;
    }
    this.scene.add(sun, sun.target);
  }

  private buildTerrain(): Mesh {
    const segments = this.compact ? 150 : 200;
    const geometry = new PlaneGeometry(WORLD_SIZE, WORLD_SIZE, segments, segments);
    geometry.rotateX(-Math.PI / 2);
    const position = geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < position.count; i++) {
      position.setY(i, heightAt(position.getX(i), position.getZ(i)));
    }
    geometry.computeVertexNormals();

    const normal = geometry.attributes.normal as BufferAttribute;
    const colors = new Float32Array(position.count * 3);
    const meadow = new Color("#7e9656");
    const meadowDeep = new Color("#5c7240");
    const shore = new Color("#bcae88");
    const rock = new Color("#646b69");
    const rockDark = new Color("#474e4d");
    const snow = new Color("#f7f8f9");
    const c = new Color();
    const tmp = new Color();
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const z = position.getZ(i);
      const h = position.getY(i);
      const slope = 1 - normal.getY(i);
      const n = fbm(x * 0.07, z * 0.07, 3);
      c.copy(meadow).lerp(meadowDeep, clamp(0.5 + n * 1.2, 0, 1));
      if (lakeDistance(x, z) < 1.2 && h < WATER_LEVEL + 1.4) c.lerp(shore, 0.75);
      const rockT = Math.max(smoothstep(15, 27, h + n * 5), smoothstep(0.34, 0.56, slope));
      c.lerp(tmp.copy(rock).lerp(rockDark, clamp(0.5 - n, 0, 1)), rockT);
      const snowT = smoothstep(36, 44, h + n * 6) * (1 - smoothstep(0.34, 0.5, slope));
      c.lerp(snow, snowT);
      colors.set([c.r, c.g, c.b], i * 3);
    }
    geometry.setAttribute("color", new BufferAttribute(colors, 3));

    const terrain = new Mesh(
      geometry,
      new MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.96, metalness: 0 }),
    );
    terrain.receiveShadow = true;
    return terrain;
  }

  private buildLake(): Mesh {
    const geometry = new CircleGeometry(1, 96);
    geometry.rotateX(-Math.PI / 2);
    const lake = new Mesh(
      geometry,
      new MeshStandardMaterial({ color: "#3f8088", roughness: 0.06, metalness: 0.15, transparent: true, opacity: 0.95 }),
    );
    lake.scale.set(LAKE.rx + 6, 1, LAKE.rz + 6);
    lake.position.set(LAKE.x, WATER_LEVEL, LAKE.z);
    lake.receiveShadow = true;
    return lake;
  }

  /** Gravel road winding up the valley to a stone forecourt at the hotel. */
  private buildRoad(): Group {
    const group = new Group();
    const geometry = ribbonGeometry(ROAD, 1.7, 140);
    const gravel = new MeshStandardMaterial({
      color: "#cdbd9d",
      roughness: 1,
      side: DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    const road = new Mesh(geometry, gravel);
    road.receiveShadow = true;

    const forecourt = new Mesh(new BoxGeometry(38, 0.16, 8), new MeshStandardMaterial({ color: "#d6c9b0", roughness: 0.95 }));
    forecourt.position.set(8, hotelY + 0.08, 4.5);
    forecourt.receiveShadow = true;

    group.add(road, forecourt);
    return group;
  }

  private buildHotel(): Group {
    const hotel = new Group();
    hotel.position.y = hotelY;
    const roof = new MeshStandardMaterial({ color: "#2e3a3c", roughness: 0.7, metalness: 0.1 });

    const main = building({ width: 26, height: 10, depth: 11, floors: 3, seed: 11, roof });
    main.position.set(6, 0, -12);
    const pavilion = building({ width: 9, height: 14, depth: 13, floors: 4, seed: 23, roof, roofHeight: 5 });
    pavilion.position.set(6, 0, -12.5);
    const wing = building({ width: 17, height: 8.4, depth: 9, floors: 3, seed: 37, roof });
    wing.position.set(29, 0, -11);

    // Balconies along the rooms wing.
    const slabMaterial = new MeshStandardMaterial({ color: "#d6cfc2", roughness: 0.8 });
    for (const y of [2.9, 5.7]) {
      const slab = new Mesh(new BoxGeometry(16, 0.25, 1.1), slabMaterial);
      slab.position.set(29, y, -6.1);
      hotel.add(slab);
    }

    // Glass spa pavilion with a lit interior and the outdoor pool.
    const spa = new Group();
    spa.position.set(-13, 0, -9);
    const glass = new Mesh(
      new BoxGeometry(13, 4.2, 9),
      new MeshStandardMaterial({ color: "#d8e6e4", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.4 }),
    );
    glass.position.y = 2.1;
    const glow = new Mesh(
      new BoxGeometry(12, 3.6, 8),
      new MeshStandardMaterial({ color: "#f3dcc0", emissive: new Color("#ffcf96"), emissiveIntensity: 0.55 }),
    );
    glow.position.y = 1.8;
    const lid = new Mesh(new BoxGeometry(14.6, 0.5, 10.6), stone());
    lid.position.y = 4.45;
    spa.add(glow, glass, lid);

    const poolDeck = new Mesh(new BoxGeometry(14, 0.3, 8), new MeshStandardMaterial({ color: "#d9ccb4", roughness: 0.9 }));
    poolDeck.position.set(-13, 0.15, 0.5);
    const pool = new Mesh(
      new BoxGeometry(11, 0.2, 5.4),
      new MeshStandardMaterial({ color: "#78c3c9", emissive: new Color("#2f8f99"), emissiveIntensity: 0.45, roughness: 0.08 }),
    );
    pool.position.set(-13, 0.36, 0.5);

    // Dining terrace with lanterns.
    const deck = new Mesh(new BoxGeometry(20, 0.5, 5), new MeshStandardMaterial({ color: "#8a6d52", roughness: 0.8 }));
    deck.position.set(6, 0.25, -3.5);
    const post = new CylinderGeometry(0.1, 0.12, 1.7, 6);
    const bulb = new SphereGeometry(0.28, 12, 8);
    const postMaterial = new MeshStandardMaterial({ color: "#2b2721", roughness: 0.6 });
    const bulbMaterial = new MeshStandardMaterial({ color: "#ffe2b0", emissive: new Color("#ffb45e"), emissiveIntensity: 2.4 });
    for (let i = 0; i < 7; i++) {
      const x = -3 + i * 3;
      const p = new Mesh(post, postMaterial);
      p.position.set(x, 1.35, -1.2);
      const b = new Mesh(bulb, bulbMaterial);
      b.position.set(x, 2.3, -1.2);
      hotel.add(p, b);
    }

    // Gold flag above the grand hall.
    const mast = new Mesh(new CylinderGeometry(0.08, 0.08, 4, 6), postMaterial);
    mast.position.set(6, 21.5, -12.5);
    const flag = new Mesh(
      new BoxGeometry(1.8, 1, 0.05),
      new MeshStandardMaterial({ color: "#b08e55", roughness: 0.4, metalness: 0.5 }),
    );
    flag.position.set(6.95, 22.8, -12.5);

    hotel.add(main, pavilion, wing, spa, poolDeck, pool, deck, mast, flag);
    return shadowed(hotel);
  }

  private buildChapel(): Group {
    const chapel = new Group();
    chapel.position.set(-38, chapelY, -21);
    const roof = new MeshStandardMaterial({ color: "#33403f", roughness: 0.75 });
    const walls = new MeshStandardMaterial({ color: "#e0d9cc", roughness: 0.95 });

    const nave = new Mesh(new BoxGeometry(5.5, 5.5, 10), walls);
    nave.position.y = 2.75;
    const cap = new Mesh(gableRoofGeometry(10.6, 6.3, 3), roof);
    cap.rotation.y = Math.PI / 2;
    cap.position.y = 5.5;
    const tower = new Mesh(new BoxGeometry(3, 9.5, 3), walls);
    tower.position.set(0, 4.75, 6.3);
    const spire = new Mesh(new ConeGeometry(2.3, 6.5, 4), roof);
    spire.rotation.y = Math.PI / 4;
    spire.position.set(0, 12.75, 6.3);
    const rose = new Mesh(
      new CircleGeometry(0.8, 16),
      new MeshStandardMaterial({ color: "#ffd9a0", emissive: new Color("#ffb45e"), emissiveIntensity: 1.2 }),
    );
    rose.position.set(0, 6.8, 7.82);

    chapel.add(nave, cap, tower, spire, rose);
    return shadowed(chapel);
  }

  /** The footpath up through the pines, and a small timber shelter at the viewpoint. */
  private buildTrail(): Group {
    const path = new Mesh(
      ribbonGeometry(TRAIL, 0.75, 160),
      new MeshStandardMaterial({
        color: "#b8a47f",
        roughness: 1,
        side: DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      }),
    );
    path.receiveShadow = true;

    const timber = new MeshStandardMaterial({ color: "#7a5a3c", roughness: 0.85 });
    const slate = new MeshStandardMaterial({ color: "#2e3a3c", roughness: 0.7 });
    const shelter = new Group();
    const back = new Mesh(new BoxGeometry(5, 2.6, 0.4), timber);
    back.position.set(0, 1.3, -1.6);
    const left = new Mesh(new BoxGeometry(0.4, 2.6, 3.6), timber);
    left.position.set(-2.3, 1.3, 0);
    const right = left.clone();
    right.position.x = 2.3;
    const bench = new Mesh(new BoxGeometry(3.6, 0.3, 0.9), timber);
    bench.position.set(0, 0.8, -0.9);
    const roof = new Mesh(gableRoofGeometry(5.8, 4.4, 1.6), slate);
    roof.position.y = 2.6;
    shelter.add(back, left, right, bench, roof);
    shelter.position.copy(TRAIL_TO);
    // The open side looks down the valley to the lake.
    shelter.rotation.y = Math.atan2(LAKE.x - TRAIL_TO.x, LAKE.z - TRAIL_TO.z);

    const trail = new Group();
    trail.add(path, shadowed(shelter));
    return trail;
  }

  private buildTrees(): InstancedMesh {
    const count = this.compact ? 650 : 1000;
    const geometry = new ConeGeometry(1, 1, 7);
    geometry.translate(0, 0.5, 0);
    const trees = new InstancedMesh(
      geometry,
      new MeshStandardMaterial({ color: "#ffffff", roughness: 0.9, flatShading: true }),
      count,
    );
    const rand = random(20260928);
    const palette = ["#2d4535", "#355140", "#27392e", "#3d5a44"].map((hex) => new Color(hex));
    const matrix = new Matrix4();
    const rotation = new Quaternion();
    const scale = new Vector3();
    const at = new Vector3();

    let placed = 0;
    for (let tries = 0; placed < count && tries < count * 40; tries++) {
      const x = (rand() - 0.5) * (WORLD_SIZE - 16);
      const z = (rand() - 0.5) * (WORLD_SIZE - 16);
      const h = heightAt(x, z);
      if (h < WATER_LEVEL + 0.9 || h > 26.5) continue;
      if (isReserved(x, z, 5)) continue;
      if (TRAIL_SAMPLES.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < 9)) continue;
      if (ROAD_SAMPLES.some((p) => (p.x - x) ** 2 + (p.z - z) ** 2 < 20)) continue;
      const slope = Math.abs(heightAt(x + 1, z) - h) + Math.abs(heightAt(x, z + 1) - h);
      if (slope > 2.4) continue;
      // Denser forest on the slopes than on the valley floor.
      if (rand() > 0.28 + 0.62 * smoothstep(3, 14, h)) continue;

      const height = 4.5 + rand() * 4.5;
      const radius = height * (0.24 + rand() * 0.08);
      at.set(x, h - 0.3, z);
      scale.set(radius, height, radius);
      matrix.compose(at, rotation, scale);
      trees.setMatrixAt(placed, matrix);
      trees.setColorAt(placed, palette[Math.floor(rand() * palette.length)]);
      placed++;
    }
    trees.count = placed;
    trees.castShadow = true;
    trees.receiveShadow = true;
    return trees;
  }

  private buildSnow(): Points {
    const count = this.compact ? 700 : 1400;
    const rand = random(7);
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 240;
      positions[i * 3 + 1] = rand() * 90;
      positions[i * 3 + 2] = (rand() - 0.5) * 240;
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    const snow = new Points(
      geometry,
      new PointsMaterial({ color: "#ffffff", size: 0.45, transparent: true, opacity: 0.8, depthWrite: false }),
    );
    snow.frustumCulled = false;
    return snow;
  }
}
