import * as THREE from 'three';
import { PointerLockControls } from '../three.js-dev/examples/jsm/controls/PointerLockControls.js';
import { minDistanceView, maxDistanceView } from './utils/sizer.js';

export class Application{
    constructor(scene, renderer) {
        this.props = [];
        this.scene = scene;
        this.renderer = renderer;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.canJump = true;
        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.vertex = new THREE.Vector3();
        this.prevTime = performance.now();
        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
        this.buildScene();
        this.move();
    }

    buildScene(){
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set( -1, 20, -200 );
        this.controls = new PointerLockControls(this.camera, document.body);

        window.addEventListener('click', () => {
            this.getControls().lock();
        });

        this.scene.add(this.controls.getObject());

        window.addEventListener('keyup',  (keyboard) => {
            switch(keyboard.key){
                case 'w':
                    this.moveForward = false;
                    break;
                case 'a':
                    this.moveLeft = false;
                    break;
                case 's':
                    this.moveBackward = false;
                    break;
                case 'd':
                    this.moveRight = false;
                    break;
            }
        });

        window.addEventListener('keydown', (keyboard) => {
            switch(keyboard.key){
                case 'w':
                    this.moveForward = true;
                    break;
                case 'a':
                    this.moveLeft = true;
                    break;
                case 's':
                    this.moveBackward = true;
                    break;
                case 'd':
                    this.moveRight = true;
                    break;
                case ' ':
                    console.log("here");
                    if(this.canJump === true) this.velocity.y += 350;
                    this.canJump = false;
                    break;
            }
        });

        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener( 'resize', this.onWindowResize, false );
        this.render();
    }

    render(){
        requestAnimationFrame(() => {
            this.render();
            this.move();
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

    addToScene(meshs){
        meshs.forEach(mesh => {
            this.scene.add(mesh);
        });
    }

    move() {
        const time = performance.now();
        const delta = (time - this.prevTime) / 1000;

        if (this.controls.isLocked === true) {
            this.raycaster.ray.origin.copy( this.controls.getObject().position );
            this.raycaster.ray.origin.y -= 10;

            this.velocity.x -= this.velocity.x * 1.0 * delta;
            this.velocity.z -= this.velocity.z * 1.0 * delta;

            this.velocity.y -= 9.8 * 100.0 * delta;

            this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize();

            if ( this.moveForward || this.moveBackward ) this.velocity.z -= this.direction.z * 300 * delta;
            if ( this.moveLeft || this.moveRight ) this.velocity.x -= this.direction.x * 300 * delta;

            this.controls.moveRight( - this.velocity.x * delta );
            this.controls.moveForward( - this.velocity.z * delta );

            this.controls.getObject().position.y += ( this.velocity.y * delta );

            if ( this.controls.getObject().position.y < 10 ) {
                console.log("here 1");
                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;

                this.canJump = true;
            }
        }

        this.prevTime = time;
    }

    getControls(){
        return this.controls;
    }
}