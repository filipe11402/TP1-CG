import * as THREE from 'three';

export class WoodPlank{
    constructor(scene) {
        this.scene = scene;

        this.createMesh(this.loadTexture('../assets/Planks012_1K_Color.jpg'));
    }

    loadTexture(path){
        let texture = new THREE.TextureLoader().load(path);

        return texture;
    }

    createMesh(texture){
        let woodGeometry = new THREE.BoxGeometry(100, 300, 15);
        let woodMaterial = new THREE.MeshBasicMaterial({ map: texture });

        let planeMesh = new THREE.Mesh(woodGeometry, woodMaterial);

        planeMesh.position.y = 750;

        this.scene.add(planeMesh);
    }
}