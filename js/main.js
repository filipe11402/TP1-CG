import { Application } from './application.js';
import { OceanWater } from './water.js';
import { SunsetSky } from './sky.js';
import { WoodPlank } from './wood_plank.js';
import { WoodenPilar } from './wooden_pilar.js';
import * as THREE from 'three';
import { Sun } from './sun.js';
import { OBJLoader } from 'OBJLoader';
import { FBXLoader } from 'FBXLoader';
import { WoodenBridge } from './wooden_bridge.js';
import * as CANNON from 'Cannon';
import { BoxGeometry } from 'three';
import { GLTFLoader } from 'GLTFLoader';

class Boat{
    constructor(scene){
        this.loadModel(scene);
    }

    loadModel(scene){
        const fbxLoader = new GLTFLoader();
        fbxLoader.load('../assets/scene.gltf', (object) => {
            scene.add(object.scene);
            object.scene.position.set(0, 0, - 1000);
            object.scene.scale.set(0.1, 0.1, 0.08);
            
            this.boat = object.scene;
    })
    }

    update(position, quaternion){
        if(this.boat){
            // this.boat.translateZ(position.z);
            this.boat.position.copy(position);
            this.boat.quaternion.copy(quaternion);
        }
    }
}

let world = new CANNON.World();

let scene = (function () {
    var instance;

    function createInstance() {
        var object = new THREE.Scene();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

/**
 * TODO: extract this to three_factory.js
 */
let renderer = (function () {
    var instance;

    function createInstance() {
        var object = new THREE.WebGLRenderer({antialias: true, alpha: true});
        object.shadowMap.enabled = true;
        object.autoClear = false;
        object.shadowMap.type = THREE.PCFSoftShadowMap;

        object.setPixelRatio(window.devicePixelRatio);
        object.setSize(window.innerWidth, window.innerHeight);

        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

let sun = (function () {
    var instance;

    function createInstance() {
        var object = new Sun(scene.getInstance());
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

let sky = (function () {
    var instance;

    function createInstance() {
        var object = new SunsetSky(scene.getInstance(), sun.getInstance(), renderer.getInstance());
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

let oceanWater = (function () {
    var instance;

    function createInstance() {
        var object = new OceanWater(512, 512, scene.getInstance(), sun.getInstance());
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

let loader = new OBJLoader();
loader.load('../assets/marsColorTest.obj', function(object){
    
    object.rotation.x = - Math.PI / 2;
    object.position.x = - 3000;
    object.position.z = 5000;
    object.position.y = - 200;
    let texture = new THREE.TextureLoader().load('../assets/Marscolor.png');

    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material.map = texture;
        }
    } );

    scene.getInstance().add(object);
});

loader.load('../assets/marsColorTest.obj', function(object){
    object.rotation.x = - Math.PI / 2;
    object.position.x = - 6500;
    object.position.z = 5000;
    object.position.y = - 200;
    let texture = new THREE.TextureLoader().load('../assets/Marscolor.png');

    object.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.material.map = texture;
        }
    } );

    scene.getInstance().add(object);
});

let boat = new Boat(scene.getInstance());
console.log(boat);

let bridge = new WoodenBridge(scene.getInstance());

let meshs = [
    new THREE.AmbientLight(),
    oceanWater.getInstance().getObject(),
    sky.getInstance().getObject()
];

let app = new Application(scene.getInstance(),
    renderer.getInstance(),
    boat,
    oceanWater.getInstance());

app.addToScene(meshs);
app.addToScene(bridge.getLegs());
app.addToScene(bridge.getFloor());

