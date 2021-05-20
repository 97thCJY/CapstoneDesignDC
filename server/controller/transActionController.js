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

export const purchaseRequest = (req, res) => {
	res.send('end');

	///여띠기 만들면댐
};

export const validationTesting = (req, res, next) => {
	const { purchase } = req.body;

	//validation testing 만들기

	next();
};
