import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { deal, checkTrade, write, postTransact, trading } from '../controller/transActionController.js';

const transActionRouter = express.Router();

transActionRouter.get('/', deal);
transActionRouter.get(routes.write, write);
transActionRouter.post(routes.write, onlyPrivate, postTransact);

transActionRouter.get(routes.checkTrade, checkTrade);
transActionRouter.get(routes.trading, trading);

transActionRouter.get('*', onlyPrivate, isUnvalidRoutes);

export default transActionRouter;
