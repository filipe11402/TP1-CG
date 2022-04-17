import { Water } from 'Water'
import * as THREE from 'three';

export class OceanWater{
    constructor(width, height){
        this.height = height;
        this.width = width;

        /**
         * TODO: make size/with sent by parameters
        */
        this.waterGeometry = new THREE.PlaneGeometry(2000, 2000);
        this.water = new Water(
            this.waterGeometry,
            {
                textureWidth: this.width,
                textureHeight: this.height,
                waterNormals: new THREE.TextureLoader().load( '../three.js-dev/examples/textures/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7
            }
        );

        this.setPosition(Math.PI / 2);
    }

    loadTexture(){
        /**
         * TODO: load texture based on path
         */
    }

    setPosition(x){
        this.water.rotation.x = - x;
    }

    getObject(){
        return this.water;
    }
}