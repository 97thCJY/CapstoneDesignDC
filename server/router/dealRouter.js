import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { deal, deal_num, write, now } from '../controller/dealController.js';

const dealRouter = express.Router();

dealRouter.get('/', deal);
dealRouter.get(routes.write, write); // router.home 접근시, homecontroller -> home 실행
dealRouter.get(routes.deal_num, deal_num);
dealRouter.get(routes.now, now);


export default dealRouter;