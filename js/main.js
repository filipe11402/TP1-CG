import { Application } from './application.js';
import { OceanWater } from './water.js';

let oceanWater = new OceanWater(512, 512);

let app = new Application(oceanWater.getObject());
app.add(oceanWater.getObject());