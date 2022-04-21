import { Application } from './application.js';
import { OceanWater } from './water.js';
import { SunsetSky } from './sky.js';
import * as THREE from 'three';
import { Sun } from './sun.js';

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

scene.getInstance().add(oceanWater.getInstance().getObject());
scene.getInstance().add(sky.getInstance().getObject());

let app = new Application(scene.getInstance(),
    renderer.getInstance());