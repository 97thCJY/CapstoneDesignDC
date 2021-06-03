//home 라우팅

// 문제 상황 및 해야할 목록 작성하시오
/*

1. login ,join 에 경우 post method 작성해야함
2. 더 많은 컨트롤러 있음.


*/

import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import { home, join, getLogIn, postLogIn, logOut, postJoin, message } from '../controller/homeController.js';

const homeRouter = express.Router();

homeRouter.get(routes.home, onlyPublic, home); // router.home 접근시, homecontroller -> home 실행
homeRouter.get(routes.login, onlyPublic, getLogIn);
homeRouter.post(routes.login, onlyPublic, postLogIn);

homeRouter.get(routes.logOut, onlyPrivate, logOut);

homeRouter.get(routes.join, onlyPublic, join);
homeRouter.post(routes.join, onlyPublic, postJoin);

homeRouter.get("/message/:message", message);

homeRouter.get('*', isUnvalidRoutes); // 이외에  지정하지 않은 라우트에 대해서 전부 home으로 redirect

export default homeRouter;
