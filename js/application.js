import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { minDistanceView, maxDistanceView } from './utils/sizer.js';
import { OBJLoader } from 'OBJLoader';

export class Application{
    constructor(scene, renderer) {
        this.props = [];
        this.scene = scene;
        this.renderer = renderer;
        this.buildScene();
    }

    buildScene(){
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set( -1, 2000, 0 );
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        
        // this.controls.minDistance = minDistanceView;
        // this.controls.maxDistance = maxDistanceView;
        this.controls.maxPolarAngle = 1.5;
        // this.controls.enablePan = false;

        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
        this.render();
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