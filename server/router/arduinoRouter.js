import express from 'express';
import routes from '../routes.js';
import { checkElectric, getElec, tmp } from '../controller/arduinoController';

const arduinoRouter = express.Router();

arduinoRouter.get('/', checkElectric);      // for GET test
arduinoRouter.post('/tmp', tmp);            // for POST test
arduinoRouter.get('/api/elec/:PK/:eUsage/:eCharge/:eSupply', getElec);  // 전기량 받기

//arduinoRouter.get('*', isUnvalidRoutes);

export default arduinoRouter;
