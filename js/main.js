import * as THREE from 'https://cdn.skypack.dev/three@v0.138.2';


class Client {
    constructor() {
        this.props = [];
        this.buildScene();
    }

    buildScene(){
        //general client configsd
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 50;

        //renderer configs
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.autoClear = false;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        var cubeGeometry = new THREE.BoxGeometry( 10, 10, 10 );
        var cubeMaterial = new THREE.MeshBasicMaterial( {color: 0xFF0000} );
        var mesh = new THREE.Mesh(cubeGeometry, cubeMaterial);

        this.scene.add(mesh);

        this.renderer.setClearColor(new THREE.Color(0x000000));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.render();
    }

    render(){
        requestAnimationFrame(() => {
            this.render();
        });

        //CHECK HERE FOR DATA TO UPDATE

        this.renderer.render(this.scene, this.camera);
    }
}

let client = new Client();