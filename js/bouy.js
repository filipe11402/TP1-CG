import { FBXLoader } from 'FBXLoader';

export class Bouy{
    constructor(scene, xpos, ypos, zpos, name){
        this.xpos = xpos;
        this.ypos = ypos;
        this.zpos = zpos;
        this.name = name;
        this.loadModel(scene);
    }

    loadModel(scene){
        const fbxLoader = new FBXLoader();
        fbxLoader.load('../assets/buoy.fbx', (object) => {
            object.position.set(this.xpos, this.ypos, this.zpos);
            object.name = this.name;
            object.scale.set(0.5, 0.5, 0.5);
            scene.add(object);
            
            this.bouy = object;
        });
    }
}