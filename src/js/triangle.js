import * as THREE from "three";

import texture from "/assets/textures/matcaps/10.png";

export default class Triangle {
  constructor(options, scene) {
    this.scene = scene;

    this.init();
  }

  init() {
    this.indexOpacityEased = { value: 0 };

    this.addTriangle();
  }

  addTriangle() {
    this.geometry = new THREE.ConeGeometry(1, 1.788, 3);
    this.material = new THREE.MeshMatcapMaterial();

    this.material.transparent = true;

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

  animate(time, hoverEased) {
    this.mesh.rotation.y = time * 0.01;
    this.mesh.rotation.x = time * 0.02;

    this.material.opacity = hoverEased;
  }
}
