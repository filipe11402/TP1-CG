import * as THREE from 'three';
import { PointerLockControls } from '../three.js-dev/examples/jsm/controls/PointerLockControls.js';
import { minDistanceView, maxDistanceView } from './utils/sizer.js';
import * as CANNON from 'Cannon';
import { Bouy } from './bouy.js';

export class Application{
    constructor(scene, renderer, boat, water, world) {
        this.world = world;
        this.boat = boat;
        this.scene = scene;
        this.water = water;
        this.renderer = renderer;
        this.buildScene();
    }

    buildScene(){
        this.world.defaultContactMaterial.friction = 0;

        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set( -500, 100, -800 );
        this.controls = new PointerLockControls(this.camera, document.body);

        this.buildBouies(5);
        this.buildColisionBodies();

        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.boatBody,
            indexRightAxis: 0, // x
            indexUpAxis: 1, // y
            indexForwardAxis: 2, // z
        });

        var options = {
            radius: 20,
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
            useCustomSlidingRotationalSpeed: true,
        };

        options.chassisConnectionPointLocal.set(-50, 10, -100)
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(50, 10, -100)
        this.vehicle.addWheel(options);
        
        options.chassisConnectionPointLocal.set(50, 10, 100)
        this.vehicle.addWheel(options);
        
        options.chassisConnectionPointLocal.set(-50, 10, 100)
        this.vehicle.addWheel(options);

        this.vehicle.addToWorld(this.world);

        var wheelBodies = [];
        this.vehicle.wheelInfos.forEach((wheel) => {
            const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
            const wheelBody = new CANNON.Body({
              mass: 0,
              material: this.world.wheelMaterial,
            })
            wheelBody.type = CANNON.Body.KINEMATIC
            wheelBody.collisionFilterGroup = 0 // turn off collisions
            const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
            wheelBodies.push(wheelBody)
            this.world.addBody(wheelBody)
        });
        
        this.world.addEventListener('postStep', () => {
            for (var i=0; i<this.vehicle.wheelInfos.length; i++) {
              this.vehicle.updateWheelTransform(i);
              var t = this.vehicle.wheelInfos[i].worldTransform;

              wheelBodies[i].position.copy(t.position);
              wheelBodies[i].quaternion.copy(t.quaternion);
            }
          });


        window.addEventListener('click', () => {
            this.getControls().lock();
        });

        this.scene.add(this.controls.getObject());

        window.addEventListener('keyup',  (keyboard) => {
            switch(keyboard.key){
                case 'w':
                    this.vehicle.applyEngineForce(0, 0);
                    this.vehicle.applyEngineForce(0, 1);
                    break;
                case 'a':
                    this.vehicle.setSteeringValue(0, 2);
                    this.vehicle.setSteeringValue(0, 3);
                    break;
                case 's':
                    this.vehicle.applyEngineForce(0, 0);
                    this.vehicle.applyEngineForce(0, 1);
                    break;
                case 'd':
                    this.vehicle.setSteeringValue(0, 2);
                    this.vehicle.setSteeringValue(0, 3);
                    break;
            }
        });

        window.addEventListener('keydown', (keyboard) => {
            const speed = 5000;
            const steering = 0.2;
            switch(keyboard.key){
                case 'w':
                    this.vehicle.applyEngineForce(-speed, 0);
                    this.vehicle.applyEngineForce(-speed, 1);

                    break;
                case 'a':
                    
                    this.vehicle.setSteeringValue(steering, 2);
                    this.vehicle.setSteeringValue(steering, 3);

                    break;
                case 's':
                    this.vehicle.applyEngineForce(speed, 0);
                    this.vehicle.applyEngineForce(speed, 1);

                    break;
                case 'd':
                    this.vehicle.setSteeringValue(-steering, 2);
                    this.vehicle.setSteeringValue(-steering, 3);
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
        });
        
        this.world.step(1 / 60);

        this.water.water.position.copy(this.floorBody.position);
        this.water.water.quaternion.copy(this.floorBody.quaternion);

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

    getControls(){
        return this.controls;
    }

    buildBouies(total){
        let bouies = [
            new Bouy(this.scene, 100, -5, - 1200, "bouy1"),
            new Bouy(this.scene, 1000, -5, - 2000, "bouy2"),
            new Bouy(this.scene, -1000, -5, - 2000, "bouy3"),
            new Bouy(this.scene, -2000, -5, - 1000, "bouy4"),
            new Bouy(this.scene, 10, -5, - 600, "bouy5")
        ];
        const boxShape = new CANNON.Box(new CANNON.Vec3(10, 10, 10));

        bouies.forEach( (object) => {
            let triggerBody = new CANNON.Body({ isTrigger: true })
            
            triggerBody.addEventListener('collide', (event) => {
                this.scene.remove(this.scene.getObjectByName(object.name));
            })

            triggerBody.addShape(boxShape);
            triggerBody.position.set(object.xpos, object.ypos, object.zpos);
            this.world.addBody(triggerBody);
        });
    }

    buildColisionBodies(){
        this.leftMountain = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1400, 500, 650)),
            position: new CANNON.Vec3(2000, 400, 0)
        });
        
        this.rightMountain = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Box(new CANNON.Vec3(1250, 500, 650)),
            position: new CANNON.Vec3(-1500, 400, 0)
        });

        this.boatBody = new CANNON.Body({
            mass: 150,
            shape: new CANNON.Box(new CANNON.Vec3(50, 10, 220)),
            position: new CANNON.Vec3(0, 20, - 1000)
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

        this.world.addBody(this.rightMountain);
        this.world.addBody(this.leftMountain);
        this.world.addBody(this.bridgeBody);
        this.world.addBody(this.boatBody);
        this.world.addBody(this.floorBody);
    }
}