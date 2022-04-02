import * as THREE from 'https://cdn.skypack.dev/three@v0.138.2'

class Cube extends THREE.Object3D{
    constructor(x, y, z, color){
        super();
        this.position.set(x,y,z);
    }


    move(){

    }
}