import { Application } from './application.js';
import { OceanWater } from './water.js';
import { SunsetSky } from './sky.js';
import { WoodPlank } from './wood_plank.js';
import { WoodenPilar } from './wooden_pilar.js';
import * as THREE from 'three';
import { Sun } from './sun.js';
import { OBJLoader } from 'OBJLoader';
import { FBXLoader } from 'FBXLoader';

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
 * TODO: extract this to other class
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

let fbxLoader = new FBXLoader();
fbxLoader.load('../assets/3d-model.fbx', function(object) {
    object.position.y = - 30;
    object.position.z = - 1000;
    object.scale.set(0.001, 0.001, 0.001);
    
    scene.getInstance().add(object);
})

/**
 * TODO: move this from here
 */

let light = new THREE.AmbientLight();
scene.getInstance().add(light);

let meshs = [
    new WoodPlank(scene.getInstance(), 1.5707963268, 100, 20).getMesh(),
    new WoodenPilar(scene.getInstance(), - 200, 20, 400).getMesh(),
    new WoodenPilar(scene.getInstance(), - 200, 20, 0).getMesh(),
    new WoodenPilar(scene.getInstance(), 600, 20, 0).getMesh(),
    new WoodenPilar(scene.getInstance(), 600, 20, 400).getMesh(),
    oceanWater.getInstance().getObject(),
    sky.getInstance().getObject()
];

let app = new Application(scene.getInstance(),
    renderer.getInstance());

app.addToScene(meshs);