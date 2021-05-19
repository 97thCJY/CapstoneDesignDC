import routes from "../routes";
import Transaction from '../models/transaction';

export const deal = (req, res) => {
    res.render('deal', {
        pageTitle: 'deal',
    });
};

export const write = (req, res) => {
    res.render('add-deal', {
        pageTitle: 'add-deal',
    });
};

export const postTransact = async(req, res) => {
    const { amount, description } = req.body;

    try {
        const transaction = await Transaction({
            amount,
            description,
            PK: PKN,
            seller: req.user.PK,
            createdAt: Date.now
        });
        PKN++;

        await Transaction.register(transaction);
        console.log('writting complete!!');

        res.redirect(routes.deal);
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