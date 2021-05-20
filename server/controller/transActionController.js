import routes from '../routes';
import Transaction from '../models/transaction';
import User from '../models/user';

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

export const checkTrade = async (req, res) => {
	const {params: { id }} = req;
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

export const trading = (req, res) => {
	console.log(req);
};

const parseDate = (date) => {
	const sDate = JSON.stringify(date);

	let parsed = date.substring(0, 10);

	return parsed;
};

// 이메일 설정
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

// 구매 요청
export const purchaseRequest = async (req, res) => {
	const {params: { id }} = req;
	let data;
	let seller;
	try {
		data = await Transaction.findOne({ PK: id });
		seller = await User.findOne({ PK: data.seller });
	} catch (e) {
		console.log(e);
	}

	console.log(req.body);	console.log(req.user);
	console.log(data);		console.log(seller);
	// return res.send("브레이크!");

  	// 이메일 보내기
  	let info = await transporter.sendMail({
		from: '"Greedy" <hyncompany0@gmail.com>', // sender address
		to: seller.email, // list of receivers
		subject: "[구매알림] " + seller.name + "님 구매요청 내역을 확인해주세요.", // Subject line
		html: "<h1>" + req.user.name + "님의 구매 요청</h1><h3>구매량: " + req.body.purchase + "kw</h3><hr>\
		<a href='http://localhost:3000/main/transaction/accept/" + id + "/" + req.user.PK + "/" + req.body.purchase + "' style='margin-right:`15px`;'><button style='background-color:#4CAF50; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>수락하기</button></a>\
		<a href='http://localhost:3000/main/transaction/reject/" + id + "'><button style='background-color:`#555555`; color:`white`; width:`65px`; height:`30px`; border-radius:`10px`;'>거절하기</button></a>"
  	});

  	console.log("Message sent: %s", info.messageId);
	res.redirect('/main' + routes.transAction);
};

export const validationTesting = (req, res, next) => {
	const { purchase } = req.body;

	//validation testing 만들기

	next();
};

// 구매 요청 승인
export const purchaseAccept = async (req, res) => {
	const {params: { pk, buyerId, amount }} = req;

	console.log("" + pk + " " + buyerId + " " + amount);
	// transaction.buyer_id = buyerId
	// transaction.status = 2
	// transaction.amount = amount
	// transaction.createdAt = date.now()	????
	// DB저장

	res.send("승인하쎴쎼여~?");
}

// 구매 요청 거절
export const purchaseReject = async (req, res) => {
	const {params: { pk }} = req;

	console.log("" + pk);
	// transaction.status = 0
	// DB저장

	res.send("거절이라니.. 너무행~!");
}