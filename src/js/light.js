import * as THREE from "three";

export default class Light {
  constructor(scene) {
    this.scene = scene;

    this.init();
  }

  init() {
    this.addLight();
  }

  addLight() {
    this.pointLight = new THREE.PointLight("#fff", 2, 15);
    // this.scene.add(this.pointLight);

    this.pointLightHelper = new THREE.PointLightHelper(this.pointLight, 0.1);
    // this.scene.add(this.pointLightHelper);
  }

  animate(time) {
    this.pointLight.position.set(Math.sin(time * 0.05), 2, Math.abs(Math.cos(time * 0.15)));
  }
}
