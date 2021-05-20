import routes from '../routes';
import Transaction from '../models/transaction';

export const deal = async (req, res) => {
	const targetObjList = [];

	try {
		let articleSet = await Transaction.find({});

		for (let i = 0; i < articleSet.length; i++) {
			if (articleSet[i].status !== 3) {
				let date;

				targetObjList.push(JSON.stringify(articleSet[i]));

				date = parseDate(JSON.parse(targetObjList[i]).createdAt);

				targetObjList[i] = JSON.parse(targetObjList[i]);

				targetObjList[i].createdAt = date;
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

export const checkTrade = (req, res) => {
	const {
		params: { id }
	} = req;

	console.log(id);
};

export const trading = (req, res) => {
	res.render('deal-contents', {
		pageTitle: 'Trading'
	});
};

const parseDate = (date) => {
	const sDate = JSON.stringify(date);

	let parsed = date.substring(0, 10);

	return parsed;
};
