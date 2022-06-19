import * as THREE from 'three';
import { PointerLockControls } from '../three.js-dev/examples/jsm/controls/PointerLockControls.js';
import { minDistanceView, maxDistanceView } from './utils/sizer.js';
import * as CANNON from 'Cannon';

export class Application{
    constructor(scene, renderer, boat, water) {
        this.boat = boat;
        this.scene = scene;
        this.water = water;
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
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        });

        this.timeStep = 1 / 60;

        var groundMaterial = new CANNON.Material('groundMaterial');
        var wheelMaterial = new CANNON.Material('wheelMaterial');
        var wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
            friction: 0.1,
            restitution: 0,
            contactEquationStiffness: 1000,
        });

        this.world.defaultContactMaterial.friction = 0
        
        this.world.addContactMaterial(wheelGroundContactMaterial);

        let boatPhisicsGeo = new THREE.BoxGeometry(30, 20, 575);
        let boatPhisicsMat = new THREE.MeshBasicMaterial({
            wireframe: true
        });
        
        this.boatPhisicsMesh = new THREE.Mesh(boatPhisicsGeo, boatPhisicsMat);
        this.scene.add(this.boatPhisicsMesh);
        
        this.bridgeGeo = new THREE.BoxGeometry(900, 50, 420);
        this.bridgeMaterial = new THREE.MeshBasicMaterial({
            wireframe: true
        });

        this.bridgeMesh = new THREE.Mesh(this.bridgeGeo, this.bridgeMaterial);
        this.scene.add(this.bridgeMesh);
        this.bridgeMesh.position.x = 200;
        this.bridgeMesh.position.y = 5;
        this.bridgeMesh.position.z = 200;

        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set( 100, 100, -800 );
        this.controls = new PointerLockControls(this.camera, document.body);

        this.boatBody = new CANNON.Body({
            mass: 50,
            shape: new CANNON.Box(new CANNON.Vec3(60, 10, 265.5)),
            position: new CANNON.Vec3(0, 20, - 1000)
        });

        // this.boatBody.angularVelocity.set(0, 1, 0)
        
        // parent vehicle object
        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.boatBody,
            indexRightAxis: 0, // x
            indexUpAxis: 1, // y
            indexForwardAxis: 2 // z
        });

        // wheel options
        var options = {
            radius: 15,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 45,
            suspensionRestLength: 0.4,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.5,
            maxSuspensionForce: 200000,
            rollInfluence:  0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 0.25,
            customSlidingRotationalSpeed: -30,
            useCustomSlidingRotationalSpeed: true
        };

        options.chassisConnectionPointLocal.set(1, 1, 0);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(1, -1, 0);
        this.vehicle.addWheel(options);
        
        options.chassisConnectionPointLocal.set(-1, 1, 0);
        this.vehicle.addWheel(options);
        
        options.chassisConnectionPointLocal.set(-1, -1, 0);
        this.vehicle.addWheel(options);

        this.vehicle.addToWorld(this.world);

        var wheelBodies = [],
        wheelVisuals = [];
        this.vehicle.wheelInfos.forEach((wheel) => {
            var shape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            var body = new CANNON.Body({mass: 1, material: wheelMaterial});
            var q = new CANNON.Quaternion();
            body.type = CANNON.Body.KINEMATIC
            q.setFromAxisAngle(new CANNON.Vec3(10, 10, 1), -Math.PI / 2);
            body.addShape(shape, new CANNON.Vec3(), q);
            wheelBodies.push(body);
            body.collisionFilterGroup = 0
            // wheel visual body
            var geometry = new THREE.CylinderGeometry( wheel.radius, wheel.radius, 0.4, 32 );
            var material = new THREE.MeshPhongMaterial({
                wireframe: true
            });
            var cylinder = new THREE.Mesh(geometry, material);
            wheelVisuals.push(cylinder);
            this.scene.add(cylinder);
            
            this.world.addBody(body);
        });
        
        this.world.addEventListener('postStep', () => {
            for (var i=0; i<this.vehicle.wheelInfos.length; i++) {
              this.vehicle.updateWheelTransform(i);
              var t = this.vehicle.wheelInfos[i].worldTransform;
              // update wheel physics
              wheelBodies[i].position.copy(t.position);
              wheelBodies[i].quaternion.copy(t.quaternion);
              // update wheel visuals
              wheelVisuals[i].position.copy(t.position);
              wheelVisuals[i].quaternion.copy(t.quaternion);
            }
          });

        this.bridgeBody = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(450, 25, 210)),
            position: new CANNON.Vec3(200, 0, 200),
            type: CANNON.Body.STATIC
        });

        this.floorBody = new CANNON.Body({
            shape: new CANNON.Plane(512, 512),
            type: CANNON.Body.STATIC
        });

        this.floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.world.addBody(this.bridgeBody);
        this.world.addBody(this.boatBody);
        this.world.addBody(this.floorBody);

        window.addEventListener('click', () => {
            this.getControls().lock();
        });

        this.scene.add(this.controls.getObject());

        window.addEventListener('keyup',  (keyboard) => {
            this.vehicle.setBrake(0, 0);
            this.vehicle.setBrake(0, 1);
            this.vehicle.setBrake(0, 2);
            this.vehicle.setBrake(0, 3);
            switch(keyboard.key){
                case 'w':
                    this.vehicle.applyEngineForce(0, 2);
                    this.vehicle.applyEngineForce(0, 3);
                    // this.boatBody.position.z += 10;
                    break;
                case 'a':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    break;
                case 's':
                    this.vehicle.applyEngineForce(0, 2);
                    this.vehicle.applyEngineForce(0, 3);
                    // this.moveBackward = false;
                    break;
                case 'd':
                    this.vehicle.setSteeringValue(0, 0);
                    this.vehicle.setSteeringValue(0, 1);
                    // this.moveRight = false;
                    break;
            }
        });

        window.addEventListener('keydown', (keyboard) => {
            this.vehicle.setBrake(0, 0);
            this.vehicle.setBrake(0, 1);
            this.vehicle.setBrake(0, 2);
            this.vehicle.setBrake(0, 3);
            switch(keyboard.key){
                case 'w':
                    this.vehicle.applyEngineForce(800, 2);
                    this.vehicle.applyEngineForce(-800, 3);
                    // this.moveForward = true;
                    break;
                case 'a':
                    this.vehicle.setSteeringValue(Math.PI / 8, 0);
                    this.vehicle.setSteeringValue(Math.PI / 8, 1);
                    // this.moveLeft = true;
                    break;
                case 's':
                    this.vehicle.applyEngineForce(-800, 2);
                    this.vehicle.applyEngineForce(800, 3);
                    // this.moveBackward = true;
                    break;
                case 'd':
                    this.vehicle.setSteeringValue(-Math.PI / 8, 0);
                    this.vehicle.setSteeringValue(-Math.PI / 8, 1);
                    break;
                case ' ':
                    // if(this.canJump === true) this.velocity.y += 350;
                    // this.canJump = false;
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
            // this.move();
        });
        
        this.world.step(this.timeStep);

        this.boatPhisicsMesh.position.copy(this.boatBody.position);
        this.boatPhisicsMesh.quaternion.copy(this.boatBody.quaternion);

        this.water.water.position.copy(this.floorBody.position);
        this.water.water.quaternion.copy(this.floorBody.quaternion);

        this.bridgeMesh.position.copy(this.bridgeBody.position);
        this.bridgeMesh.quaternion.copy(this.bridgeBody.quaternion);
        
        this.boat.update(this.boatBody.position, this.boatBody.quaternion);
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