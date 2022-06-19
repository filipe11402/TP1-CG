import * as CANNON from 'Cannon';

export class World{
    constructor(){
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0)
        });
        
        this.loadConfiguration();
    }

    loadConfiguration(){
        this.groundMaterial = new CANNON.Material('ground');
        this.wheelMaterial = new CANNON.Material('wheel');
        this.wheelGroundContactMaterial = new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
            friction: 0.3,
            restitution: 0,
            contactEquationStiffness: 1000,
        });

        this.world.defaultContactMaterial.friction = 0.5;
        this.world.addContactMaterial(this.wheelGroundContactMaterial);
    }
}