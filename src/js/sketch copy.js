import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { TweenMax as TM, Power3 } from "gsap/all";

import texture from "/assets/textures/matcaps/8.png";

console.log(texture);

export default class Sketch {
  constructor(options) {
    this.clock = new THREE.Clock();

    this.listColors = options.listColors;
    this.listDateColors = options.listDateColors;

    this.dateEl = options.dateEl;
    this.timeEls = options.timeEls;

    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 10);
    this.camera.position.z = 1;
    this.camera.position.x = 0;
    this.camera.position.y = -0.5;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("#030303");
    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.indexOpacityEased = { value: 0 };

    this.resize();
    this.setupResize();
    this.addLight();
    this.addTriangle();
    this.updateColorTriangle();
    this.updateOpacityTriangle();
    this.render();
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addLight() {
    this.pointLight = new THREE.PointLight("#fff", 2, 15);
    // this.scene.add(this.pointLight);

    this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.1);
    // this.scene.add(this.pointLightHelper);
  }

  animateLight(time) {
    this.pointLight.position.set(Math.sin(time * 0.05), 2, Math.abs(Math.cos(time * 0.15)));
  }

  addTriangle() {
    this.geometry = new THREE.ConeGeometry(1, 1.788, 3);
    this.material = new THREE.MeshMatcapMaterial();

    this.material.transparent = true;
    this.material.opacity = 0.8;

    this.addTexture();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.y = 1;
    this.mesh.position.x = -0.5;
    this.scene.add(this.mesh);
  }

  addTexture() {
    if (!this.material) return;
    this.textureLoader = new THREE.TextureLoader();

    this.matCapTexture = this.textureLoader.load(texture);

    this.material.matcap = this.matCapTexture;
  }

  updateColorTriangle() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("mouseenter", () => {
        const indexColor = [...this.timeEls].indexOf(timeEl);

        // Change color triangle
        // this.material.color = new THREE.Color(this.listColors[indexColor]);

        // Change color date
        this.dateEl.style.color = this.listDateColors[indexColor];
      });
    });
  }

  updateOpacityTriangle() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("mouseenter", () => {
        this.indexOpacity = ([...this.timeEls].indexOf(timeEl) + 1) / this.timeEls.length;

        TM.to(this.indexOpacityEased, 0.7, {
          value: this.indexOpacity,
          ease: Power3,
        });
        console.log(this.indexOpacityEased.value);
      });
    });
  }

  animateTriangle(time) {
    this.mesh.rotation.y = time * 0.01;
    this.mesh.rotation.x = time * 0.02;
  }

  render() {
    this.material.opacity = this.indexOpacityEased.value;

    this.elapsedTime = this.clock.getElapsedTime();

    // Animate light
    this.animateLight(this.elapsedTime);

    // Animate triangle
    this.animateTriangle(this.elapsedTime);

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call render on each frame
    window.requestAnimationFrame(this.render.bind(this));
  }
}
