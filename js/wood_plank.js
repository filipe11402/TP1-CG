import * as THREE from 'three';

export class WoodPlank{
    constructor(scene, x, y, z, rotationx, rotationy, rotationz) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotationx = rotationx;
        this.rotationy = rotationy;
        this.rotationz = rotationz;
        this.mesh = this.createMesh(this.loadTexture('../assets/Planks012_1K_Color.jpg'));
    }

    loadTexture(path){
        let texture = new THREE.TextureLoader().load(path);

        return texture;
    }

    createMesh(texture){
        /**
         * TODO: pass wooden plank sizes from ctor
         */
        let woodGeometry = new THREE.BoxGeometry(20, 400, 15);
        let woodMaterial = new THREE.MeshBasicMaterial({ map: texture });

        let planeMesh = new THREE.Mesh(woodGeometry, woodMaterial);

        planeMesh.rotation.z = this.x;
        planeMesh.position.y = this.y;
        planeMesh.position.x = 30;

        return planeMesh;
    }

    getMesh(){
        return this.mesh;
    }
}