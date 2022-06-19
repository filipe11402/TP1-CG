import { Water } from 'Water'
import * as THREE from 'three';

export class OceanWater{
    constructor(width, height, scene, sun){
        this.height = height;
        this.width = width;
        this.scene = scene;
        this.sun = sun;

        this.waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        this.water = new Water(
            this.waterGeometry,
            {
                textureWidth: this.width,
                textureHeight: this.height,
                waterNormals: this.loadTexture('../three.js-dev/examples/textures/waternormals.jpg'),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7
            }
        );
        this.water.material.uniforms[ 'sunDirection' ].value.copy( this.sun ).normalize();
    }

    loadTexture(path){
        return new THREE.TextureLoader().load( path, function ( texture ) {
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;});
    }

    setPosition(x){
        this.water.rotation.x = - x;
    }

    getObject(){
        return this.water;
    }
}