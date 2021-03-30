//home 라우팅

import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { home, join, logIn, logOut } from '../controller/homeController.js';

const homeRouter = express.Router();

homeRouter.get(routes.home, home); // router.home 접근시, homecontroller -> home 실행
homeRouter.get(routes.login, logIn);
homeRouter.get(routes.logOut, logOut);
homeRouter.get(routes.join, join);
homeRouter.get('*', isUnvalidRoutes); // 이외에  지정하지 않은 라우트에 대해서 전부 home으로 redirect

export default homeRouter;
