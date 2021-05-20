import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import {
	deal,
	checkTrade,
	write,
	postTransact,
	trading,
	purchaseRequest,
	validationTesting
} from '../controller/transActionController.js';

const transActionRouter = express.Router();

transActionRouter.get('/', deal);
transActionRouter.get(routes.write, write);
transActionRouter.post(routes.write, onlyPrivate, postTransact);

//transActionRouter.get(routes.trading, trading);

transActionRouter.get(routes.checkTrade(), checkTrade);
transActionRouter.post(routes.checkTrade(), validationTesting, purchaseRequest);
transActionRouter.get('*', onlyPrivate, isUnvalidRoutes);

export default transActionRouter;
