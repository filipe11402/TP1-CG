import * as THREE from 'three';

export class WoodenPilar{
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.mesh = this.createMesh(this.loadTexture('../assets/Planks012_1K_Color.jpg'));
    }

    loadTexture(path){
        let texture = new THREE.TextureLoader().load(path);

        return texture;
    }

    createMesh(texture){
        let woodGeometry = new THREE.CylinderGeometry(2, 2, 50, 50, 15);
        let woodMaterial = new THREE.MeshBasicMaterial({ map: texture });

        let planeMesh = new THREE.Mesh(woodGeometry, woodMaterial);

        planeMesh.position.x = this.x;
        planeMesh.position.y = this.y;
        planeMesh.position.z = this.z;

        return planeMesh;
    }

    getMesh(){
        return this.mesh;
    }
}