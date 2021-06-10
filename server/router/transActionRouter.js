import express from 'express';
import routes from '../routes.js';
import { onlyPublic, onlyPrivate, isUnvalidRoutes } from '../middleware.js';
import {
	deal,
	write,
	checkTrade,
	postTransact,
	purchaseReq,
	purchaseAccept,
	purchaseReject,
	finalAccept,
	deleteTransaction,
	modifyTransaction
} from '../controller/transActionController.js';

const transActionRouter = express.Router();

// rendering page
transActionRouter.get('/',onlyPrivate, deal); // 판매글 목록 페이지
//transActionRouter.get('/?'+':id' , onlyPrivate, pageDeal)
transActionRouter.get(routes.write,onlyPrivate, write); // 판매글 작성 페이지
transActionRouter.get(routes.checkTrade(), onlyPrivate, checkTrade); // 판매글 세부내용 페이지

transActionRouter.post(routes.modifyTransaction, onlyPrivate, modifyTransaction);	// 판매글 수정
transActionRouter.post(routes.write, onlyPrivate, postTransact); // 판매글 작성
transActionRouter.post(routes.deleteTransaction, onlyPrivate , deleteTransaction);	// 판매글 삭제
transActionRouter.post(routes.checkTrade(),onlyPrivate, purchaseReq); // 구매 요청

// Response for Email
transActionRouter.get('/accept/:pk/:hash',onlyPrivate, purchaseAccept); // 판매자 승인
transActionRouter.get('/reject/:pk/:isBuyer/:hash', onlyPrivate,purchaseReject); // 구매자 또는 판매자 거절
transActionRouter.get('/final/accept/:pk/:hash',onlyPrivate, finalAccept); // 구매자 최종 승인

// for auth
//transActionRouter.get('*', onlyPrivate, isUnvalidRoutes);

export default transActionRouter;
