//home 라우팅

// 문제 상황 및 해야할 목록 작성하시오
/*

1. login ,join 에 경우 post method 작성해야함
2. 더 많은 컨트롤러 있음.


*/

import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';

import { home, userProfile, checkElec, addDevice, remoteOnOff, deleteDevice } from '../controller/mainController.js';

const mainRouter = express.Router({
	mergeParams: true
});

mainRouter.get('/', onlyPrivate, home);
mainRouter.post('/', onlyPrivate, addDevice);
mainRouter.post('/remoteonoff', onlyPrivate, remoteOnOff);
mainRouter.get(routes.user, onlyPrivate, userProfile);
mainRouter.post(routes.delete, onlyPrivate, deleteDevice);

mainRouter.get(routes.checkElec, onlyPrivate, checkElec);

//mainRouter.get('*', isUnvalidRoutes);

export default mainRouter;
