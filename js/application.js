import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { SunsetSky } from './sky.js';

export class Application{
    constructor(floor) {
        this.props = [];
        this.floor = floor;
        this.loadSky();
        this.buildScene();
        this.addToScene();
    }

    buildScene(){
        this.scene = new THREE.Scene();
        this.scene.add(this.sky);
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(-1, 100, 0);

        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.sun = new THREE.Vector3();
        const skyUniforms = this.sky.material.uniforms;

        skyUniforms[ 'turbidity' ].value = 10;
        skyUniforms[ 'rayleigh' ].value = 2;
        skyUniforms[ 'mieCoefficient' ].value = 0.005;
        skyUniforms[ 'mieDirectionalG' ].value = 0.8;
        
        const parameters = {
            elevation: 2,
            azimuth: 180
        };

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        this.sky.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        this.scene.environment = pmremGenerator.fromScene( this.sky ).texture;

        this.floor.material.uniforms[ 'sunDirection' ].value.copy( this.sun ).normalize();

        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
        this.render();
    }

    addToScene(){
        this.scene.add(this.floor);
    }

    loadSky(){
        var skyObj = new SunsetSky();
        this.sky = skyObj.getObject();
    }

    render(){
        requestAnimationFrame(() => {
            this.render();
        });
        
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize(){
        this.camera.left = window.innerWidth / - 2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / - 2;
        this.camera.updateProjectionMatrix();
    
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}