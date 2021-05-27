import routes from '../routes';
import Transaction from '../models/transaction';
import User from '../models/user';

// 이메일 모듈 설정 (Gmail)
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
	service: 'gmail',
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: "hyncompany0@gmail.com",
		pass: "wlgkqhekwltkd"
	}
});

/*** GET Method ***/
// 판매글 목록 페이지 출력
export const deal = async (req, res) => {
	const targetObjList = [];

	try {
		let articleSet = await Transaction.find({});

		for (let i = 0; i < articleSet.length; i++) {
			if (articleSet[i].status !== 3) {
				let date;
				const user = await User.find({ PK: articleSet[i].seller });

				targetObjList.push(JSON.stringify(articleSet[i]));
				date = parseDate(JSON.parse(targetObjList[i]).createdAt);
				targetObjList[i] = JSON.parse(targetObjList[i]);
				targetObjList[i].createdAt = date;
				targetObjList[i].sellerName = user[0].name;
			}
		}
		targetObjList.reverse();
	} catch (e) {
		console.log(e);
	} finally {
		res.render('deal', {
			pageTitle: 'TransAction',
			topNav: 'transAction',
			articleList: targetObjList
		});
	}
};

// 판매글 작성 페이지 출력
export const write = (req, res) => {
	res.render('add-deal', {
		pageTitle: 'add-deal',
		topNav: 'transAction'
	});
};

// 판매글 내용 페이지 출력
export const checkTrade = async (req, res) => {
	const {params: { id }}= req;
	let data;
	let seller;
	try {
		data = await Transaction.find({ PK: id });
		data = JSON.parse(JSON.stringify(data));
		data[0].createdAt = data[0].createdAt.substring(0, 10);
		seller = await User.find({ PK: data[0].seller });
	} catch (e) {
		console.log(e);
	}
	res.render('deal-contents', {
		pageTitle: 'Trading',
		topNav: 'transAction',
		data: data[0],
		seller: seller[0],
		user: req.user
	});
};

/*** 이메일 응답용 GET Method ***/
// 구매 요청 & 판매자에게 승인 이메일 전송
export const purchaseRequest = async (req, res) => {
	const {params: { id }} = req;	// transaction_id
	const crypto = require('crypto');	// hash 라이브러리
	let transaction;		// 판매글
	let seller;				// 판매자
	const buyer = req.user;	// 구매자
	const reqAmount = req.body.purchase;
	
	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: id });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}

	/**** 삭제 필요 log ****/
	////////////////////////////////////////////////////////
	console.log(req.body); console.log(buyer);
	console.log(transaction); console.log(seller);

	/**** 작업 필요? : 유효성 검사 (validationTest 활용?) ****/
	////////////////////////////////////////////////////////

	// 해시값 생성
	const tmp = id + buyer.PK + Date.now().toString() + reqAmount;
	const hash = crypto.createHash('md5').update(tmp).digest('hex');

	try {	// transaction table 변경
		const changed = await transaction.update({
			status: 1,
			hash: hash,
			reqAmount: reqAmount,
			buyer: buyer.PK
		});
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 수정 오류: " + e);
	}
  	
	/**** 작업 필요 : 이메일 템플릿 생성 ****/
	////////////////////////////////////////////////////////
	// 이메일 보내기
	// 수락: accept/{transaction.pk}/{buyer.pk}/{transaction.req_amount}/{transaction.hash}
	// 거부: reject/{transaction.pk}/{transaction.hash}
  	let info = await transporter.sendMail({
		from: '"Greedy" <hyncompany0@gmail.com>',
		to: seller.email,
		subject: "[구매알림] " + seller.name + "님 구매요청 내역을 확인해주세요.",
		html: "<h1>" + buyer.name + "님의 구매 요청</h1><h3>구매량: " + reqAmount + "kw</h3><hr>\
		<a href='http://localhost:3000/main/transaction/accept/" + id + "/" + buyer.PK + "/" + reqAmount + "/" + hash + "' style='margin-right:`15px`;'><button style='background-color:#4CAF50; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>수락하기</button></a>\
		<a href='http://localhost:3000/main/transaction/reject/" + id + "/" + hash + "'><button style='background-color:`#555555`; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>거절하기</button></a>"
  	});

  	console.log("Message sent: %s", info.messageId);
	
	/**** 작업 필요 : 메시지 템플릿 rendering ****/
	////////////////////////////////////////////////////////
	res.redirect('/main' + routes.transAction);
};

// 유효성검사 validation testing 만들기
export const validationTesting = (req, res, next) => {
	const { purchase } = req.body;
	next();
};

// 판매자 승인 이메일: 구매 요청 승인
export const purchaseAccept = async (req, res) => {
	const {params: { pk, buyerId, amount, hash }} = req;
	let transaction;		// 판매글
	let buyer;				// 판매자

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: buyerId });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}

	// hash값 비교
	if (hash !== transaction.hash)
		return res.send("해시값 다름\n" + hash + "\n" + transaction.hash);

	// new hash값 생성
	const tmp = buyerId + Date.now().toString() + amount + pk;
	const new_hash = crypto.createHash('md5').update(tmp).digest('hex');

	try {	// transaction table 변경
		const changed = await transaction.update({
			status: 2,
			hash: new_hash,
		});
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 수정 오류: " + e);
	}
	
	/**** 작업 필요 : 구매자한테 최종 승인 이메일 보내기 ****/
	////////////////////////////////////////////////////////
	
	/**** 작업 필요 : 메시지 템플릿 rendering ****/
	////////////////////////////////////////////////////////
	res.send("승인하쎴쎼여~? " + pk + " " + buyerId + " " + amount + " " + hash);
}

// 판매자 승인 이메일: 구매 요청 거절
export const purchaseReject = async (req, res) => {
	const {params: { pk, hash }} = req;

	console.log("" + pk);
	// DB저장
	// transaction.status = 0
	// buyerId = -1
	// reqAmount = 0

	res.send("거절이라니.. 너무행~! " + pk + " " + hash);
}

/*** POST Method ***/
// 판매글 추가 요청
export const postTransact = async (req, res) => {
	const { amount, description } = req.body;
	const { PK, email, IP } = req.user;

	try {
		const transactionList = await Transaction.find({});

		console.log(transactionList);
		const transaction = await Transaction.create({
			amount,
			description,
			PK: transactionList.length + 1, //관련 수정 요구
			seller: PK,
			createdAt: Date.now()
		});
		res.redirect('/main' + routes.transAction);
	} catch (e) {
		console.log(e);
		res.redirect(routes.write);
	}
};




/*** 추가 사용 함수 ***/
// 날짜 데이터 파싱 함수
const parseDate = (date) => {
	const sDate = JSON.stringify(date);

	let parsed = date.substring(0, 10);

	return parsed;
};