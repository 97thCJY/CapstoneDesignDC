import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import {
	deal,
	checkTrade,
	write,
	postTransact,
	purchaseRequest,
	purchaseAccept,
	purchaseReject
} from '../controller/transActionController.js';

const transActionRouter = express.Router();

transActionRouter.get('/', deal);
transActionRouter.get(routes.write, write);
transActionRouter.post(routes.write, onlyPrivate, postTransact);

transActionRouter.get('/accept/:pk/:buyerId/:amount/:hash', purchaseAccept);
transActionRouter.get('/reject/:pk/:hash', purchaseReject);


transActionRouter.get(routes.checkTrade(), checkTrade);
transActionRouter.post(routes.checkTrade(), purchaseRequest);
transActionRouter.get('*', onlyPrivate, isUnvalidRoutes);

export default transActionRouter;
