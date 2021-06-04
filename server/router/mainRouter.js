import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import {
	home,
	userProfile,
	checkElec,
	addDevice,
	remoteOnOff,
	deleteDevice,
	deviceModification,
	status
} from '../controller/mainController.js';

const mainRouter = express.Router({
	mergeParams: true
});

mainRouter.get('/', onlyPrivate, home);
mainRouter.post('/', onlyPrivate, addDevice);
mainRouter.post('/remoteonoff', onlyPrivate, remoteOnOff);
mainRouter.get(routes.user, onlyPrivate, userProfile);
mainRouter.post(routes.user, onlyPrivate, userProfile);
mainRouter.post(routes.delete, onlyPrivate, deleteDevice);
mainRouter.post(routes.saveDevice, onlyPrivate, deviceModification);
mainRouter.get(routes.status, onlyPrivate, status);
mainRouter.post(routes.status, onlyPrivate, status);


mainRouter.get(routes.checkElec, onlyPrivate, checkElec);
mainRouter.post(routes.checkElec, onlyPrivate, checkElec);

//mainRouter.get('*', isUnvalidRoutes);

export default mainRouter;
