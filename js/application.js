import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { Water } from 'Water';
import { Sky } from 'Sky';

export class Application{
    constructor() {
        this.props = [];
        this.buildScene();
    }

    buildScene(){
        //general client configs
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(-1, 100, 0);

        this.waterGeo = new THREE.PlaneGeometry(2000, 2000);

        var water = new Water(
            this.waterGeo,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( '../three.js-dev/examples/textures/waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7
            }
        );
        
        water.rotation.x = - Math.PI / 2;

        this.scene.add(water);  

        //renderer configs
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.sky = new Sky();
        this.sky.scale.setScalar( 10000 );
        this.scene.add(this.sky);

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

        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        this.sky.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( this.sun ).normalize();

        this.scene.environment = pmremGenerator.fromScene( this.sky ).texture;

        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.render();
    }

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        this.renderer.render(this.scene, this.camera);
    }
}