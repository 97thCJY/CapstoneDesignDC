import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { deal, checkTrade, write, postTransact, trading } from '../controller/transActionController.js';

const transActionRouter = express.Router();

transActionRouter.get('/', deal);
transActionRouter.get(routes.write, write); // router.home 접근시, homecontroller -> home 실행
transActionRouter.get(routes.checkTrade, checkTrade);
transActionRouter.get(routes.trading, trading);

transActionRouter.post(routes.write, onlyPublic, postTransact);

export default transActionRouter;
