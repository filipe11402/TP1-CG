import * as THREE from 'three';
import { WoodenPilar } from './wooden_pilar.js';
import { WoodenPlank } from './wood_plank.js';

export class WoodenBridge{
    constructor(scene) {
        this.scene = scene;
        this.legs = [];
        this.planks = [];
    }
}