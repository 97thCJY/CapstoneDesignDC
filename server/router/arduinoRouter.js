import express from 'express';
import routes from '../routes.js';
import {
    checkElectric, getElec, tmp
} from '../controller/arduinoController';

const arduinoRouter = express.Router();

arduinoRouter.get('/', checkElectric);
arduinoRouter.post('/tmp', tmp);
arduinoRouter.get('/api/ver-1/elec/:PK/:eUsage/:eCharge/:eSupply', getElec);  // 전기량 받기

//arduinoRouter.get('*', isUnvalidRoutes);

export default arduinoRouter;
