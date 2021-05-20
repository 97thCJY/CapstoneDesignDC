import routes from '../routes';
import Transaction from '../models/transaction';

export const deal = async (req, res) => {
	const targetObjList = [];

	try {
		let articleSet = await Transaction.find({});

		console.log(articleSet);

		for (let i = 0; i < articleSet.length; i++) {
			if (articleSet[i].status !== 3) {
				//createdAtList.push(parseDate(articleSet[i].createdAt));

				// articleSet[i].createdAt = parseDate(articleSet[i].createdAt);

				targetObjList.push(articleSet[i]);
				targetObjList[0]['created_str'] = parseDate(articleSet[i].createdAt);
			}

			console.log(targetObjList);
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
	var tmp_month = date.getUTCMonth() + 1;
	var tmp_date = date.getUTCDate();
	var tmp_hours = date.getUTCHours();
	var tmp_minutes = date.getUTCMinutes();
	let date_str =
		date.getFullYear() +
		'/' +
		(tmp_month < 10 ? '0' + tmp_month : tmp_month) +
		'/' +
		(tmp_date < 10 ? '0' + tmp_date : tmp_date) +
		' ' +
		(tmp_hours < 10 ? '0' + tmp_hours : tmp_hours) +
		':' +
		(tmp_minutes < 10 ? '0' + tmp_minutes : tmp_minutes);

	return date_str;
};
