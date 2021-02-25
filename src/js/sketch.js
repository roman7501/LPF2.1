import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import Light from "./light";
import Triangle from "./triangle";

import { TweenMax as TM, Power3 } from "gsap/all";

export default class Sketch {
  constructor(options) {
    this.container = options.dom;

    // this.listColors = options.listColors;
    // this.listDateColors = options.listDateColors;

    this.dateEl = options.dateEl;
    this.timeEls = options.timeEls;

    this.options = options;

    this.init();
  }

  init() {
    this.clock = new THREE.Clock();

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

    // Utils
    this.hoverEased = { value: 1 };

    // Lights
    this.light = new Light(this.scene);

    // Objects
    this.triangle = new Triangle(this.options, this.scene);

    this.resize();
    this.setupResize();
    this.computeHoverEased();
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

  computeHoverEased() {
    this.timeEls.forEach((timeEl) => {
      timeEl.addEventListener("mouseenter", () => {
        this.indexOpacity = ([...this.timeEls].indexOf(timeEl) + 1) / this.timeEls.length;

        TM.to(this.hoverEased, 0.7, {
          value: this.indexOpacity,
          ease: Power3,
        });
      });
    });
  }

  render() {
    this.elapsedTime = this.clock.getElapsedTime();

    // Animate light
    this.light.animate(this.elapsedTime);

    // Animate triangle
    this.triangle.animate(this.elapsedTime, this.hoverEased.value);

    // Update controls
    this.controls.update();

    // Render
    this.renderer.render(this.scene, this.camera);

    // Call render on each frame
    window.requestAnimationFrame(this.render.bind(this));
  }
}
