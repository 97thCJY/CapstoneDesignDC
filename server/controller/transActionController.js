import routes from '../routes';
import Transaction from '../models/transaction';
import User from '../models/user';

const crypto = require('crypto'); // hash 라이브러리

const nodemailer = require('nodemailer'); // 이메일 모듈 설정 (Gmail)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'input your email',
		pass: 'input your password'
	}
});

/*** GET Method ***/
// 판매글 목록 페이지 출력
export const deal = async (req, res) => {
	const targetObjList = [];
	let { page } = req.query;

	page = page ? page: 1;
	let articleSet = await Transaction.find({});
	articleSet = articleSet.reverse();
	try {
		let max = page*10 <= articleSet.length ? page*10 : articleSet.length;

		let cnt = 0;
		for (let i = (page-1)*10 ; i < max; i++) {
		
				let date;
				const user = await User.findOne({ PK: articleSet[i].seller });

				targetObjList.push(JSON.stringify(articleSet[i]));
				date = parseDate(JSON.parse(targetObjList[cnt]).createdAt);
				targetObjList[cnt] = JSON.parse(targetObjList[cnt]);
				targetObjList[cnt].sellerName = user.name;
				targetObjList[cnt].createdAt = date;
				cnt++;
			}
	} catch (e) {
		console.log(e);
	} finally {
		res.render('deal', {
			pageTitle: 'TransAction',
			topNav: 'transAction',
			articleList: targetObjList,
			articleLength: articleSet.length,
			page,
			forES: JSON.stringify(targetObjList)
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
	const { params: { id } } = req;
	let data;
	let seller;
	try {
		data = await Transaction.find({ PK: id });
		data = JSON.parse(JSON.stringify(data));
		data[0].createdAt = data[0].createdAt.substring(0, 10);
		seller = await User.find({ PK: data[0].seller });
		console.log(data);
	} catch (e) {
		console.log(e);
	}
	res.render('deal-contents', {
		pageTitle: 'Trading',
		topNav: 'transAction',
		data: data[0],
		seller: seller[0],
		user: req.user,
		description: data[0].description
	});
};

/*** 이메일 응답용 GET Method ***/
// 판매자 승인
export const purchaseAccept = async (req, res) => {
	const { params: { pk, hash } } = req;
	let transaction; // 판매글
	let buyer; // 판매자
	let seller; // 구매자

	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log(e);
		return res.redirect('/message/' + "Error: 데이터베이스 로딩 오류");
	}

	// hash값 비교
	if (hash !== transaction.hash) {
		console.log("해시값 다름\n" + hash + "\n" + transaction.hash);
		return res.redirect('/message/' + "이미 완료된 요청이거나 잘못된 요청입니다.");
	}
	
	// 유효성 검사
	const validationTmp = sellerValidationTest(seller, transaction.reqAmount);
	if (validationTmp === 0) {
		return res.redirect('/message/' + "판매 불가: 배터리 여유공간이 부족합니다.");
	} else if (validationTmp === 1) {
		return res.redirect('/message/' + "판매 불가: 현재 배터리의 사용량이 충전량보다 많습니다.");
	}

	// new hash값 생성
	const tmp = transaction.buyer + Date.now().toString() + transaction.reqAmount + pk;
	const new_hash = crypto.createHash('md5').update(tmp).digest('hex');

	try {
		// transaction table 변경
		const changed = await transaction.update({
			status: 2,
			hash: new_hash
		});
	} catch (e) {
		console.log("데이터베이스 수정 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 로딩 오류");
	}
	
	// 이메일 보내기
	const email_body = emailTempleteConfirm(seller.name, buyer.name, transaction.description, transaction.reqAmount, 
		`http://116.42.123.180/main/transaction/final/accept/${pk}/${new_hash}`,
		`http://116.42.123.180/main/transaction/reject/${pk}/1/${new_hash}`,
		'전력 구매 최종 승인 안내',
		`${buyer.name}님이 요청하신 구매에 대해 승인하였습니다.`
	);
	let info;
	try {
		info = await transporter.sendMail({
			from: '"Greedy" <input your email>',
			to: buyer.email,
			subject: '[구매알림] ' + buyer.name + '님의 구매요청에 대한 최종 승인을 해주세요.',
			html: email_body,
			attachments: [
				{
					filename: 'ourlogo.png',
					path: './assets/images/ourlogo.png',
					cid: 'ourlogo'
				}
			]
		});
	} catch(e) {
		console.log("이메일 전송 오류: " + e);
		return res.redirect('/message/' + "Error: 이메일 전송 오류");
	}
  	console.log("Message sent: %s", info.messageId);
	
	return res.redirect('/message/' + "판매 승인 완료");
}

// 구매자 또는 판매자 거절
export const purchaseReject = async (req, res) => {
	const {
		params: { pk, isBuyer, hash }
	} = req;
	let transaction, buyer, seller;

	try {
		// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log("데이터베이스 로딩 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 로딩 오류");
	}

	// hash값 비교
	if (hash !== transaction.hash) {
		console.log("해시값 다름\n" + hash + "\n" + transaction.hash);
		return res.redirect('/message/' + "이미 완료된 요청이거나 잘못된 요청입니다.");
	}

	try {
		// transaction table 변경
		const changed = await transaction.update({
			status: 0,
			hash: '',
			buyer: 0,
			reqAmount: 0
		});
	} catch (e) {
		console.log("데이터베이스 수정 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 수정 오류");
	}

	if (isBuyer === "0") {	// 구매자 최종 거절 -> 판매자에게 이메일 알림
		const email_body = emailTempleteNotification(buyer.name, `http://116.42.123.180/main/transaction/${pk}`, "전력 구매 거절 안내",
			"회원님이 요청하신 <strong style='font-weight: bold'>[" + transaction.description + "]</strong>에 대한 구매 요청이 판매자에 의해 거절되었습니다.");
		let info;
		try {
			info = await transporter.sendMail({
				from: '"Greedy" <input your email>',
				to: buyer.email,
				subject: "[구매알림] " + buyer.name + "님이 요청하신 거래가 성사되지 않았습니다.",
				html: email_body,
				attachments: [{
					filename: 'ourlogo.png',
					path: './assets/images/ourlogo.png',
					cid: 'ourlogo'
				}]
			});
		} catch(e) {
			console.log("이메일 전송 오류: " + e);
			return res.redirect('/message/' + "Error: 이메일 전송 오류");
		}
		console.log("Message sent: %s", info.messageId);
		return res.redirect('/message/' + "판매 거절되었습니다.");
	} else {		// 판매자 판매 거절 -> 구매자에게 이메일 알림
		const email_body = emailTempleteNotification(seller.name, `http://116.42.123.180/main/transaction/${pk}`, "전력 구매 거절 안내",
			"회원님이 요청하신 <strong style='font-weight: bold'>[" + transaction.description + "]</strong>에 대한 구매 요청이 구매자에 의해 거절되었습니다.");
		let info;
		try {
			info = await transporter.sendMail({
				from: '"Greedy" <input your email>',
				to: seller.email,
				subject: "[구매알림] " + seller.name + "님이 요청하신 거래가 성사되지 않았습니다.",
				html: email_body,
				attachments: [{
					filename: 'ourlogo.png',
					path: './assets/images/ourlogo.png',
					cid: 'ourlogo'
				}]
			});
		} catch(e) {
			console.log("이메일 전송 오류: " + e);
			return res.redirect('/message/' + "Error: 이메일 전송 오류");
		}
		console.log("Message sent: %s", info.messageId);
		return res.redirect('/message/' + "구매를 최종 거절하였습니다.");
	}
};

// 구매자 최종 승인
export const finalAccept = async (req, res) => {
	const { params: { pk, hash } } = req;
	let transaction, buyer, seller;

	try {
		// DB 불러오기
		transaction = await Transaction.findOne({ PK: pk });
		buyer = await User.findOne({ PK: transaction.buyer });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log("데이터베이스 로딩 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 로딩 오류");
	}

	if (hash !== transaction.hash) {	// hash값 비교
		console.log("해시값 다름\n" + hash + "\n" + transaction.hash);
		return res.redirect('/message/' + "이미 완료된 요청이거나 잘못된 요청입니다.");
	}

	// 구매자 유효성 검사
	if (!buyerValidationTest(buyer, transaction.reqAmount))
		return res.redirect('/message/' + "구매 불가: 충전 가능한 배터리 용량이 판매 전력량 보다 적습니다.");
	
	/**** 작업 필요 유효성 검사 ****/
	// 판매자 유효성 검사
	const validationTmp = sellerValidationTest(seller, transaction.reqAmount);
	if (validationTmp === 0) {
		return res.redirect('/message/' + "판매 불가: 배터리 여유공간이 부족합니다.");
	} else if (validationTmp === 1) {
		return res.redirect('/message/' + "판매 불가: 현재 배터리의 사용량이 충전량보다 많습니다.");
	}


	try {	// transaction table 변경
		const changed = await transaction.update({ status: 3, hash: '' });
	} catch (e) {
		console.log("데이터베이스 수정 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 수정 오류");
	}

	for (let i=0; i<2; i++) {	// 구매자, 판매자 최종 안내 이메일 보내기
		let email_body, tmp_email, tmp_name, info;
		if (i === 0) {	// 구매자에게
			email_body = emailTempleteNotification(buyer.name, `http://116.42.123.180/main/transactionStatus`, "전력 거래 진행 안내",
				"회원님이 요청하신 <strong style='font-weight: bold'>[" + transaction.description + "]</strong>에 대한 거래가 시작되었습니다.<br><br>아래 버튼을 통해 거래 진행상황을 확인하세요.");
			tmp_email = buyer.email;
			tmp_name = buyer.name;
		} else {	// 판매자에게
			email_body = emailTempleteNotification(seller.name, `http://116.42.123.180/main/transactionStatus`, "전력 거래 진행 안내",
				"회원님의 <strong style='font-weight: bold'>[" + transaction.description + "]</strong>에 대한 거래가 시작되었습니다.<br><br>아래 버튼을 통해 거래 진행상황을 확인하세요.");
			tmp_email = seller.email;
			tmp_name = seller.name;
		}

		try {
			info = await transporter.sendMail({
				from: '"Greedy" <input your email>',
				to: tmp_email,
				subject: "[거래알림] " + tmp_name + "님이 요청하신 거래가 시작되었습니다.",
				html: email_body,
				attachments: [{
					filename: 'ourlogo.png',
					path: './assets/images/ourlogo.png',
					cid: 'ourlogo'
				}]
			});
		} catch (e) {
			console.log("이메일 전송 오류: " + e);
			return res.redirect('/message/' + "Error: 이메일 전송 오류");
		}
		console.log("Message sent: %s", info.messageId);
	}
	return res.redirect('/message/' + "거래가 최종 승인 및 시작되었습니다.");
}

/*** POST Method ***/
// 판매글 추가 요청
export const postTransact = async (req, res) => {
	const { amount, description , title } = req.body;
	const { PK, batteryMax } = req.user;

	// 유효성 검사
	if (batteryMax < amount) {
		return res.send(`<script type="text/javascript">alert("판매 불가: 판매하고자 하는 전력량이 배터리 용량을 초과합니다.");location.href="./";</script>`);
	}
	if (amount < 1) {
		return res.send(`<script type="text/javascript">alert("판매 불가: 판매량은 1보다 커야 합니다.");location.href="./";</script>`);
	}

	try {
		// PK 설정
		const transactionList = await Transaction.find({});
		let transPK = transactionList.length == 0 ? 0 : 1;
		if (transPK) {
			transPK = 0;
			for (let i = 0; i < transactionList.length; i++) {
				if (transPK < transactionList[i].PK) {
					transPK = transactionList[i].PK;
				}
			}
		}

		const transaction = await Transaction.create({
			amount,
			description,
			PK: transPK + 1, //관련 수정 요구
			seller: PK,
			createdAt: Date.now(),
			title
		});
		return res.redirect('/main' + routes.transAction);
	} catch (e) {
		console.log(e);
		return res.redirect(routes.write);
	}
};

// 구매 요청 & 판매자에게 승인 이메일 전송
export const purchaseReq = async (req, res) => {
	const { params: { id } } = req; 	// transaction_id
	const buyer = req.user; 	// 구매자
	const reqAmount = req.body.purchase;	// 구매 요청량
	let transaction; 			// 판매글
	let seller; 				// 판매자
	
	try {	// DB 불러오기
		transaction = await Transaction.findOne({ PK: id });
		seller = await User.findOne({ PK: transaction.seller });
	} catch (e) {
		console.log("데이터베이스 로딩 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 로딩 오류");
	}

	// 유효성검사
	if (reqAmount < 1)	// 입력된 구매량
		return res.send(`<script type="text/javascript">alert("구매량은 1보다 커야합니다.");location.href="./${id}";</script>`);
	if (transaction.amount < reqAmount)	// 입력된 구매량
		return res.send(`<script type="text/javascript">alert("판매하는 구매량보다 많습니다.");location.href="./${id}";</script>`);
	if (!buyerValidationTest(buyer, reqAmount))	// 구매자 유효성 검사
		return res.send(`<script type="text/javascript">alert("구매 불가: 충전 가능한 배터리 용량이 판매 전력량 보다 적습니다.");location.href="./${id}";</script>`);	

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
		console.log("데이터베이스 수정 오류: " + e);
		return res.redirect('/message/' + "Error: 데이터베이스 수정 오류");
	}

	// 이메일 보내기
	const email_body = emailTempleteConfirm(buyer.name, seller.name, transaction.description, reqAmount, 
		`http://116.42.123.180/main/transaction/accept/${id}/${hash}`,
		`http://116.42.123.180/main/transaction/reject/${id}/0/${hash}`,
		'전력 구매 요청 안내',
		'회원님의 판매글에 아래과 같이 구매가 요청되었습니다.'
	);
	let info;
	try {
		info = await transporter.sendMail({
			from: '"Greedy" <input your email>',
			to: seller.email,
			subject: '[구매알림] ' + seller.name + '님 구매요청 내역을 확인해주세요.',
			html: email_body,
			attachments: [{
				filename: 'ourlogo.png',
				path: './assets/images/ourlogo.png',
				cid: 'ourlogo'
			}]
		});
	} catch(e) {
		console.log("이메일 전송 오류: " + e);
		return res.redirect('/message/' + "Error: 이메일 전송 오류");
	}
	console.log('Message sent: %s', info.messageId);
	return res.redirect('/message/' + "정상적으로 구매 요청되었습니다.");
};

// 거래글 삭제 요청
export const deleteTransaction = async (req, res) =>{
	const { PK } = req.body;
	try {
		await Transaction.findOneAndDelete({ PK });
	} catch(e){
		console.log(e);
	}
	res.redirect('/main/transaction')
}

// 거래글 수정 요청
export const modifyTransaction = async(req ,res) =>{
	const {amount, title, description ,PK} = req.body;
	try{
		await Transaction.findOneAndUpdate({ PK },{
			amount,
			title,
			description
		});
	}catch(e){
		console.log(e);
	}
	res.redirect('/main/transaction');
}

/*** 추가 사용 함수 ***/
// 날짜 데이터 파싱 함수
const parseDate = (date) => {
	const sDate = JSON.stringify(date);
	let parsed = date.substring(0, 10);
	return parsed;
};

// 이메일 템플릿 (수락/거절)
function emailTempleteConfirm(from, to, desc, amount, approve_link, reject_link, title, contents) {
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

// 이메일 템플릿 (안내)
function emailTempleteNotification(to, checkLink, title, contents) {
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
						</td></tr><tr><td height="8"></td></tr><tr><td bgcolor="#f3f5f7" style="padding: 16px;text-align: center">
							<a href='${checkLink}'><button style='background-color:"#4CAF50"; color:"white"; border-radius:10px; font-size:15px; font-weight:bold;'>확인하기</button></a>
						</td></tr>
					</td></tr></tbody></table>
			</td><td></td></tr><!-- E: BODY --></tbody>
		</table>
	</td></tr><tr><td height="40"></td></tr></tbody></table></body></html>`;
	return a;
};

// 구매자 유효성 검사
// (구매하고자 하는 전력량이 구매자의 배터리에 충전 가능한 용량에 수용할 수 있는지 확인)
function buyerValidationTest(buyer, reqAmount) {
	return true;
	// if (buyer.batteryMax - buyer.eCharge >= reqAmount)	// {태양광 패널 충전량 부족으로 일단 주석처리}
	// 	return true;
	// else
	// 	return false;
}

// 판매자 유효성 검사
// (판매자의 배터리 잔량이 구매량보다 많은지 확인)
// (생산량이 소비량보다 많은지 확인)
function sellerValidationTest(seller, reqAmount) {
	console.log(seller, reqAmount);

	// 판매자의 배터리잔량 < 구매량
	// if (seller.eCharge < reqAmount)
		// return 0;
	// 판매자의 충전량 < 판매자의 사용량
	// if (seller.eSupply < seller.eUsage)	{태양광 패널 충전량 부족으로 일단 주석처리}
	// 	return 1;
	return 2;	// success
}