import { GLTFLoader } from 'GLTFLoader';

export class Boat{
    constructor(scene, xpos, ypos, zpos){
        this.xpos = xpos;
        this.ypos = ypos;
        this.zpos = zpos;
        this.loadModel(scene);
    }

    loadModel(scene){
        const fbxLoader = new GLTFLoader();
        fbxLoader.load('../assets/boat.gltf', (object) => {
            scene.add(object.scene);
            object.scene.position.set(this.xpos, this.ypos, this.zpos);
            object.scene.scale.set(0.1, 0.1, 0.08);
            
            this.boat = object.scene;
    })
    }

    update(position, quaternion){
        if(this.boat){
            // this.boat.translateZ(position.z);
            this.boat.position.copy(position);
            this.boat.quaternion.copy(quaternion);
        }
    }
}