import { Sky } from 'Sky';
import * as THREE from 'three';

export class SunsetSky{
    constructor(){
        this.sky = new Sky();
        this.sky.scale.setScalar( 10000 );
    }

    getObject(){
        return this.sky;
    }
}