import { WoodPlank } from './wood_plank.js';
import { WoodenPilar } from './wooden_pilar.js'; 

export class WoodenBridge{
    constructor(scene) {
        this.scene = scene;
        this.legs = this.loadLegs();
        this.planks = this.loadFloor();
    }

    loadFloor(){
        let planks = [];

        let plankSpace = - 200;
        for(let i = 0;i <= 57;i++){
            planks.push(
                new WoodPlank(this.scene, plankSpace, 97, 200, 1.5707963268).getMesh()
                );
            plankSpace += 14;
        }

        return planks;
    }

    loadLegs(){
        let legs = [
            new WoodenPilar(- 200, 20, 400).getMesh(),
            new WoodenPilar(- 200, 20, 0).getMesh(),
            new WoodenPilar(600, 20, 0).getMesh(),
            new WoodenPilar(600, 20, 400).getMesh(),
        ];

        return legs;
    }

    getFloor(){
        return this.planks;
    }

    getLegs(){
        return this.legs;
    }
}