import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import {
	deal,
	write,
	checkTrade,
	postTransact,
	purchaseRequest,
	purchaseAccept,
	purchaseReject,
	finalAccept
} from '../controller/transActionController.js';

const transActionRouter = express.Router();

// rendering page
transActionRouter.get('/', deal); // 판매글 목록 페이지
transActionRouter.get(routes.write, write); // 판매글 작성 페이지
transActionRouter.get(routes.checkTrade(), checkTrade); // 판매글 세부내용 페이지

// method
transActionRouter.post(routes.write, onlyPrivate, postTransact); // 판매글 작성
transActionRouter.post(routes.checkTrade(), purchaseRequest); // 구매 요청

// Response for Email
transActionRouter.get('/accept/:pk/:hash', purchaseAccept); // 판매자 승인
transActionRouter.get('/reject/:pk/:isBuyer/:hash', purchaseReject); // 구매자 또는 판매자 거절
transActionRouter.get('/final/accept/:pk/:hash', finalAccept); // 구매자 최종 승인

// for auth
transActionRouter.get('*', onlyPrivate, isUnvalidRoutes);

export default transActionRouter;
