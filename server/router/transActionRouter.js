import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { home, checkTrade, write, trading } from '../controller/transActionController.js';

const transActionRouter = express.Router();

transActionRouter.get('/', home);
transActionRouter.get(routes.write, write); // router.home 접근시, homecontroller -> home 실행
transActionRouter.get(routes.checkTrade, checkTrade);
transActionRouter.get(routes.trading, trading);

export default transActionRouter;
