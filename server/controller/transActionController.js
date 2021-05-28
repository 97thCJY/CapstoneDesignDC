import routes from '../routes';
import Transaction from '../models/transaction';
import User from '../models/user';
<<<<<<< HEAD
import nodemailer from 'nodemailer';
=======

const crypto = require('crypto');	// hash 라이브러리

const nodemailer = require("nodemailer");	// 이메일 모듈 설정 (Gmail)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: "smtp.gmail.com",
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: "hyncompany0@gmail.com",
		pass: "wlgkqhekwltkd"
	}
});
>>>>>>> hyn

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

export const write = (req, res) => {
	res.render('add-deal', {
		pageTitle: 'add-deal',
		topNav: 'transAction'
	});
};

export const postTransact = async (req, res) => {
	const { amount, description } = req.body;
	const { PK, email, IP } = req.user;

	try {
		const transactionList = await Transaction.find({});
		let PK = transactionList[0].PK | 0;

		for (let i = 0; i < transactionList.length; i++) {
			if (PK < transactionList[i].PK) {
				PK = transactionList[i].PK;
			}
		}
		const transaction = await Transaction.create({
			amount,
			description,
			PK: PK + 1, //관련 수정 요구
			seller: PK,
			createdAt: Date.now()
		});

		res.redirect('/main' + routes.transAction);
	} catch (e) {
		console.log(e);

		res.redirect(routes.write);
	}
};

export const checkTrade = async (req, res) => {
	const {
		params: { id }
	} = req;
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

<<<<<<< HEAD
export const trading = (req, res) => {
	console.log(req);
};

const parseDate = (date) => {
	const sDate = JSON.stringify(date);

	let parsed = date.substring(0, 10);

	return parsed;
};

let transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'hyncompany0@gmail.com',
		pass: 'wlgkqhekwltkd'
	}
});

// 구매 요청
export const purchaseRequest = async (req, res) => {
	/*const {
		params: { id }
	} = req;
	let data;
	let seller;

	console.log('1111');
	try {
		data = await Transaction.findOne({ PK: id });
		seller = await User.findOne({ PK: data.seller });
=======
/*** 이메일 응답용 GET Method ***/
// 판매자 승인
export const purchaseAccept = async (req, res) => {
	const {params: { pk, hash }} = req;
	let transaction;		// 판매글
	let buyer;				// 판매자
	let seller;				// 구매자

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}

	// hash값 비교
	if (hash !== transaction.hash)
		return res.send("해시값 다름\n" + hash + "\n" + transaction.hash);

	/**** 작업 필요 : 유효성 검사? ****/

	// new hash값 생성
	const tmp = transaction.buyer + Date.now().toString() + transaction.reqAmount + pk;
	const new_hash = crypto.createHash('md5').update(tmp).digest('hex');

	try {	// transaction table 변경
		const changed = await transaction.update({
			status: 2,
			hash: new_hash,
		});
>>>>>>> hyn
	} catch (e) {
		console.log(e);
	}
<<<<<<< HEAD
	// return res.send("브레이크!");

	// 이메일 보내기
	let info = await transporter.sendMail({
		from: '"Greedy" <hyncompany0@gmail.com>', // sender address
		to: seller.email, // list of receivers
		subject: '[구매알림] ' + seller.name + '님 구매요청 내역을 확인해주세요.', // Subject line
		html:
			'<h1>' +
			req.user.name +
			'님의 구매 요청</h1><h3>구매량: ' +
			req.body.purchase +
			"kw</h3><hr>\
		<a href='http://localhost:3000/main/transaction/accept/" +
			id +
			'/' +
			req.user.PK +
			'/' +
			req.body.purchase +
			"' style='margin-right:`15px`;'><button style='background-color:#4CAF50; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>수락하기</button></a>\
		<a href='http://localhost:3000/main/transaction/reject/" +
			id +
			"'><button style='background-color:`#555555`; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>거절하기</button></a>"
	});


	console.log('Message sent: %s', info.messageId);
	*/
	res.redirect('/main' + routes.transAction);
};

export const validationTesting = (req, res, next) => {
	/*
	const { purchase } = req.body;
*/
	console.log('01');
	//validation testing 만들기

	next();
};

// 구매 요청 승인
export const purchaseAccept = async (req, res) => {
	/*
	const {
		params: { pk, buyerId, amount }
	} = req;

	console.log('' + pk + ' ' + buyerId + ' ' + amount);
	*/
	console.log('purchase accept');
	// transaction.buyer_id = buyerId
	// transaction.status = 2
	// transaction.amount = amount
	// transaction.createdAt = date.now()	????
	// DB저장

	res.send('승인하쎴쎼여~?');
};

// 구매 요청 거절
export const purchaseReject = async (req, res) => {
	console.log('purchase reject');
	/*
	const {
		params: { pk }
	} = req;

	console.log('' + pk);*/
	// transaction.status = 0
	// DB저장

	res.send('거절이라니.. 너무행~!');
};
=======
	
	/**** 작업 필요 : 구매자한테 최종 승인 이메일 보내기 ****/
	// 이메일 보내기
	const email_body = emailTemplete(seller.name, buyer.name, transaction.description, transaction.reqAmount, 
		`http://localhost:3000/main/transaction/final/accept/${pk}/${new_hash}`,
		`http://localhost:3000/main/transaction/reject/${pk}/1/${new_hash}`,
		"전력 구매 최종 승인 안내", `${buyer.name}님이 요청하신 구매에 대해 승인하였습니다.`);
	let info;
	try {
		info = await transporter.sendMail({
			from: '"Greedy" <hyncompany0@gmail.com>',
			to: buyer.email,
			subject: "[구매알림] " + buyer.name + "님의 구매요청에 대한 최종 승인을 해주세요.",
			html: email_body,
			attachments: [{
				filename: 'ourlogo.png',
				path: './assets/images/ourlogo.png',
				cid: 'ourlogo'
			}]
		});
	} catch(e) {
		console.log(e);
		return res.send("이메일 전송 오류: " + e);
	}
  	console.log("Message sent: %s", info.messageId);
	
	/**** 작업 필요 : 메시지 템플릿 rendering ****/
	res.send("승인하쎴쎼여~? " + pk + " " + hash);
}

// 구매자 또는 판매자 거절
export const purchaseReject = async (req, res) => {
	const {params: { pk, isBuyer, hash }} = req;
	let transaction, buyer, seller;

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}

	// hash값 비교
	if (hash !== transaction.hash)
		return res.send("해시값 다름\n" + hash + "\n" + transaction.hash);

	try {	// transaction table 변경
		const changed = await transaction.update({
			status: 0,
			hash: "",
			buyer: 0,
			reqAmount: 0
		});
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 수정 오류: " + e);
	}

	if (isBuyer === "1") {	// 구매자 최종 거절
		// 판매자에게 거절 이메일 보내기

		/**** 작업 필요 : 메시지 템플릿 rendering ****/
		res.send("구매자 최종 거절이라니.. 너무행~!\n" + pk + " " + hash);
	} else {		// 판매자 판매 거절
		// 구매자에게 거절 이메일 보내기
		
		/**** 작업 필요 : 메시지 템플릿 rendering ****/
		res.send("판매자 거절이라니.. 너무행~!\n" + pk + " " + hash);
	}
}

// 구매자 최종 승인
export const finalAccept = async (req, res) => {
	const {params: { pk, hash }} = req;
	let transaction, buyer, seller;

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}

	if (hash !== transaction.hash)	// hash값 비교
		return res.send("해시값 다름\n" + hash + "\n" + transaction.hash);

	/**** 작업 필요 유효성 검사 ****/
		
	try {	// transaction table 변경
		const changed = await transaction.update({ status: 3, hash: "" });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 수정 오류: " + e);
	}

	
	/**** 작업 필요 : 구매자, 판매자 최종 안내 이메일 보내기 ****/

	res.send("최종승인 안내~ " + pk + " " + hash);
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
			PK: transactionList.length + 1,		//관련 수정 요구
			seller: PK,
			createdAt: Date.now()
		});
		res.redirect('/main' + routes.transAction);
	} catch (e) {
		console.log(e);
		res.redirect(routes.write);
	}
};

// 구매 요청 & 판매자에게 승인 이메일 전송
export const purchaseRequest = async (req, res) => {
	const {params: { id }} = req;	// transaction_id
	let transaction;		// 판매글
	let seller;				// 판매자
	const buyer = req.user;	// 구매자
	const reqAmount = req.body.purchase;

	// 입력된 구매량 유효성검사
	if (reqAmount < 1) 
		return res.send(`<script type="text/javascript">alert("구매량은 1보다 커야합니다.");location.href="./${id}";</script>`);

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: id });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.send("데이터베이스 로딩 오류: " + e);
	}
	// console.log(req.body); console.log(buyer); console.log(transaction); console.log(seller);

	/**** 작업 필요? : DB 유효성 검사 ****/
	/* 구매하고자 하는 전력량이 구매자의 배터리에 충전 가능한 용량에 수용할 수 있는지 확인
		if (user_battery_max – user_elec_charge > transaction_req_amount)
			pass
		else
			return error
	*/

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
  	
	// 이메일 보내기
	const email_body = emailTemplete(buyer.name, seller.name, transaction.description, reqAmount, 
		`http://localhost:3000/main/transaction/accept/${id}/${hash}`,
		`http://localhost:3000/main/transaction/reject/${id}/0/${hash}`,
		"전력 구매 요청 안내", "회원님의 판매글에 아래과 같이 구매가 요청되었습니다.");
	let info;
	try {
		info = await transporter.sendMail({
			from: '"Greedy" <hyncompany0@gmail.com>',
			to: seller.email,
			subject: "[구매알림] " + seller.name + "님 구매요청 내역을 확인해주세요.",
			html: email_body,
			attachments: [{
				filename: 'ourlogo.png',
				path: './assets/images/ourlogo.png',
				cid: 'ourlogo'
			}]
		});
	} catch(e) {
		console.log(e);
		return res.send("이메일 전송 오류: " + e);
	}
  	console.log("Message sent: %s", info.messageId);
	
	/**** 작업 필요 : 메시지 템플릿 rendering ****/
	////////////////////////////////////////////////////////
	res.redirect('/main' + routes.transAction);
};


/*** 추가 사용 함수 ***/
// 날짜 데이터 파싱 함수
const parseDate = (date) => {
	const sDate = JSON.stringify(date);
	let parsed = date.substring(0, 10);
	return parsed;
};

// 이메일 템플릿
function emailTemplete(from, to, desc, amount, approve_link, reject_link, title, contents/*, is_reject*/) {
	const a =  `
	<html><head></head><body><table width="580" border="0" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tbody><tr><td height="40"></td></tr><tr><td>
		<table width="580" border="0" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin:0 auto;">
			<tbody><tr><td height="3" width="40" bgcolor="#1ea1f7"></td><td height="3" width="500" bgcolor="#1ea1f7"></td><td height="3" width="40" bgcolor="#1ea1f7"></td></tr><tr><td></td><td>
					<table width="500" border="0" cellpadding="0" cellspacing="0">
						<tbody><tr><td height="20"></td></tr><tr><td align="center" height="32">
							<img src="cid:ourlogo" style="width: 90%;min-width: 150px;" />
						</td></tr></tbody>
					</table>
					</td><td></td></tr><!-- E: HEADER --><!-- S: BODY --><tr><td></td><td>
					<table width="500" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td height="32" style="font-size:24px;text-align: center">
						${title}
						</td></tr><tr><td height="40"></td></tr><tr><td height="40" style="line-height: 1.5;font-size: 16px; word-break: keep-all;">
						<strong style="font-weight: bold">안녕하세요, ${to}님</strong><br>
							${contents}<br><br>
							게시글 : <strong style="font-weight: bold">${desc}</strong><br>
							구매자 : <strong style="font-weight: bold">${from}님</strong><br>
							구매 요청량 : <strong style="font-weight: bold">${amount}kw</strong><br><br>
							해당 거래를 아래 버튼을 통해 승인 또는 거절을 해 주시기 바랍니다.<br>
						</td></tr><tr><td height="8"></td></tr><tr><td bgcolor="#f3f5f7" style="padding: 16px;text-align: center">
							<a href='${approve_link}' style='margin-right:15px;'><button style='background-color:"#4CAF50"; color:"white"; border-radius:10px; font-size:15px; font-weight:bold;'>수락하기</button></a>
							<a href='${reject_link}'><button style='background-color:"#555555"; color:"white"; border-radius:10px; font-size:15px; font-weight:bold;'>거절하기</button></a>
						</td></tr>
					</td></tr></tbody></table>
			</td><td></td></tr><!-- E: BODY --></tbody>
		</table>
	</td></tr><tr><td height="40"></td></tr></tbody></table></body></html>`;
	return a;
};
>>>>>>> hyn
