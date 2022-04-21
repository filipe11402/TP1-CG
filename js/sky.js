import { Sky } from 'Sky';
import * as THREE from 'three';
import { parameters } from './utils/sizer.js';

export class SunsetSky{
    constructor(scene, sun, renderer){
        this.sky = new Sky();
        this.sky.scale.setScalar( 10000 );
        this.sun = sun.getObject();
        this.scene = scene;
        this.renderer = renderer;
        this.loadProperties();
    }

    loadProperties(){
        const skyUniforms = this.sky.material.uniforms;

        skyUniforms[ 'turbidity' ].value = 10;
        skyUniforms[ 'rayleigh' ].value = 2;
        skyUniforms[ 'mieCoefficient' ].value = 0.005;
        skyUniforms[ 'mieDirectionalG' ].value = 0.8; 

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        this.sky.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        this.scene.environment = pmremGenerator.fromScene( this.sky ).texture;
    }

    getObject(){
        return this.sky;
    }
}