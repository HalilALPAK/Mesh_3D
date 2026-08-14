// ALPOTECH - yeniden kullanılabilir Three.js STL/OBJ/GLB 3D görüntüleyici
import * as THREE from "three";
import { STLLoader } from "three/addons/loaders/STLLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const loaderCache = new Map(); // url -> Promise<THREE.BufferGeometry | THREE.Object3D>

function loadGeometryOrObject(model) {
  const cacheKey = model.url + (model.mtl || "");
  if (loaderCache.has(cacheKey)) return loaderCache.get(cacheKey);

  let promise;
  if (model.type === "stl") {
    promise = new Promise((resolve, reject) => {
      new STLLoader().load(model.url, resolve, undefined, reject);
    });
  } else if (model.type === "obj") {
    promise = new Promise((resolve, reject) => {
      const objLoader = new OBJLoader();
      const loadObj = (materials) => {
        if (materials) objLoader.setMaterials(materials);
        objLoader.load(model.url, resolve, undefined, reject);
      };
      if (model.mtl) {
        new MTLLoader().load(model.mtl, loadObj, undefined, () => loadObj(null));
      } else {
        loadObj(null);
      }
    });
  } else if (model.type === "glb" || model.type === "gltf") {
    promise = new Promise((resolve, reject) => {
      new GLTFLoader().load(model.url, (gltf) => resolve(gltf.scene), undefined, reject);
    });
  } else {
    promise = Promise.reject(new Error("Bilinmeyen model tipi: " + model.type));
  }

  loaderCache.set(cacheKey, promise);
  return promise;
}

export class ModelViewer {
  /**
   * @param {HTMLElement} container
   * @param {{type:"stl"|"obj"|"glb"|"gltf",url:string,mtl?:string,rotation?:number[]}} model
   * @param {{autoRotate?:boolean, autoRotateSpeed?:number, color?:number, background?:number|null}} opts
   */
  constructor(container, model, opts = {}) {
    this.container = container;
    this.model = model;
    this.opts = Object.assign(
      { autoRotate: true, autoRotateSpeed: 2.2, color: 0x9fb8c8, background: null },
      opts
    );

    this.scene = new THREE.Scene();
    if (this.opts.background !== null) this.scene.background = new THREE.Color(this.opts.background);

    const rect = container.getBoundingClientRect();
    const width = rect.width || 300;
    const height = rect.height || 300;

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 5000);
    this.camera.position.set(0, 0, 200);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(1, 1, 1);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.4);
    fill.position.set(-1, -0.5, -1);
    this.scene.add(fill);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = this.opts.autoRotate;
    this.controls.autoRotateSpeed = this.opts.autoRotateSpeed;
    // Model boyutuna göre _fitAndCenter() içinde yeniden ayarlanır
    // (STL/OBJ dosyaları çok farklı birim ölçeklerinde olabilir: mm, cm, m...).
    this.controls.minDistance = 0.001;
    this.controls.maxDistance = 1e9;
    // Polar açısını serbest bırak: kullanıcı ürünü üstten ve alttan görebilsin.

    this._resumeTimer = null;
    this.controls.addEventListener("start", () => {
      this.controls.autoRotate = false;
      if (this._resumeTimer) clearTimeout(this._resumeTimer);
    });
    this.controls.addEventListener("end", () => {
      if (this._resumeTimer) clearTimeout(this._resumeTimer);
      this._resumeTimer = setTimeout(() => {
        if (this.opts.autoRotate) this.controls.autoRotate = true;
      }, 2500);
    });

    this.mesh = null;
    this._raf = null;
    this._resizeObserver = new ResizeObserver(() => this._onResize());
    this._resizeObserver.observe(container);

    this._disposed = false;
    this._ready = this._load();
    this._animate();
  }

  async _load() {
    try {
      const result = await loadGeometryOrObject(this.model);
      if (this._disposed) return;

      let object;
      if (result.isBufferGeometry) {
        const material = new THREE.MeshStandardMaterial({
          color: this.opts.color,
          metalness: 0.15,
          roughness: 0.55,
          side: THREE.DoubleSide,
        });
        object = new THREE.Mesh(result, material);
      } else if (this.model.type === "glb" || this.model.type === "gltf") {
        // glTF/GLB dosyaları kendi gerçek malzeme/doku bilgisini taşır, dokunmuyoruz.
        object = result.clone();
      } else {
        object = result.clone();
        // MTL dosyası verilmediyse OBJLoader'ın atadığı varsayılan malzemeyi
        // yok sayıp kendi tek renkli malzememizi uyguluyoruz. MTL verildiyse
        // (gerçek renk/doku bilgisi varsa) dokunmuyoruz.
        const hasRealMaterials = !!this.model.mtl;
        object.traverse((child) => {
          if (child.isMesh && !hasRealMaterials) {
            child.material = new THREE.MeshStandardMaterial({ color: this.opts.color, side: THREE.DoubleSide });
          }
        });
      }

      if (this.model.rotation) {
        object.rotation.set(...this.model.rotation);
      }

      this._fitAndCenter(object);
      this.mesh = object;
      this.scene.add(object);
      this.container.classList.remove("viewer-loading");
      this.container.classList.add("viewer-ready");
    } catch (err) {
      console.error("Model yüklenemedi:", this.model.url, err);
      this.container.classList.remove("viewer-loading");
      this.container.classList.add("viewer-error");
    }
  }

  _fitAndCenter(object) {
    const box = new THREE.Box3().setFromObject(object);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    object.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const fitDistance = maxDim / (2 * Math.tan((Math.PI * this.camera.fov) / 360));
    const distance = fitDistance * 1.6;

    this.camera.position.set(distance * 0.55, distance * 0.35, distance * 0.85);
    this.camera.near = distance / 100;
    this.camera.far = distance * 100;
    this.camera.updateProjectionMatrix();
    this.controls.minDistance = distance / 50;
    this.controls.maxDistance = distance * 50;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  _onResize() {
    const rect = this.container.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _animate = () => {
    if (this._disposed) return;
    this._raf = requestAnimationFrame(this._animate);
    if (this._paused) return;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  setAutoRotate(enabled) {
    this.opts.autoRotate = enabled;
    this.controls.autoRotate = enabled;
  }

  setPaused(paused) {
    this._paused = paused;
  }

  dispose() {
    this._disposed = true;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._resumeTimer) clearTimeout(this._resumeTimer);
    this._resizeObserver.disconnect();
    this.controls.dispose();
    this.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        materials.forEach((m) => m.dispose());
      }
    });
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}

// Container görünür olduğunda (IntersectionObserver) görüntüleyiciyi başlatan yardımcı fonksiyon.
export function mountLazyViewer(container, model, opts = {}) {
  let viewer = null;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !viewer) {
          container.classList.add("viewer-loading");
          viewer = new ModelViewer(container, model, opts);
        }
      }
    },
    { rootMargin: "150px" }
  );
  io.observe(container);
  return {
    dispose() {
      io.disconnect();
      if (viewer) viewer.dispose();
    },
    getViewer() {
      return viewer;
    },
  };
}
