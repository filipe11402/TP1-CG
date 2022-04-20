import * as THREE from 'three';

export class Sun{
    constructor(scene) {
        this.sun = new THREE.Vector3();
        this.loadProperties();
    }

    loadProperties(){
        const parameters = {
            elevation: 2,
            azimuth: 180
        };

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );
    }

    getObject(){
        return this.sun;
    }
}