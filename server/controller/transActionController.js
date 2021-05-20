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
	} catch (e) {
		console.log(e);
	} finally {
		res.render('deal', {
			pageTitle: 'TransAction',
			articleList: targetObjList
		});
	}
};

export const write = (req, res) => {
	res.render('add-deal', {
		pageTitle: 'add-deal'
	});
};

export const postTransact = async (req, res) => {
	const { amount, description } = req.body;
	const { PK, email, IP } = req.user;

	try {
		const transaction = await Transaction.create({
			amount,
			description,
			PK: 0, //관련 수정 요구
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
	res.send('in /deal/deal_num');
};

export const trading = (req, res) => {
	res.send('in /deal/now');
};

const parseDate = (date) => {
	const sDate = JSON.stringify(date);

	let parsed = date.substring(0, 10);

	return parsed;
};
