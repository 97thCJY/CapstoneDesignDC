import routes from './routes.js';
import multer from 'multer';
import { onAuthenticatedId, notAuthenticatedId } from './fakeDB.js';

export const globalMiddleWare = (req, res, next) => {
	res.locals.routes = routes;
	res.locals.siteName = 'Greedy';
	res.locals.PKN = 0;
	res.locals.transactionList = [];
	next();
};

export const fakeSeries = {
	User1: onAuthenticatedId,
	User2: notAuthenticatedId
};

export const breakSecurityPolicy = (req, res, next) => {
	res.setHeader('Content-Security-policy', "* 'inline-eval';");

	return next();
};

export const onlyPublic = (req, res, next) => {
	if (req.user) {
		res.redirect(routes.main);
	} else {
		next();
	}
};

export const onlyPrivate = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect(routes.home);
	}
};

export const isUnvalidRoutes = (req, res, next) => {
	if (res.status(404)) {
		if (req.user) {
			res.redirect(routes.main);
		} else {
			res.redirect(routes.login);
		}
	}
};

export const testSetDevice = [
	{
		PK: 0,
		name: 'port-1',
		status: true
	},
	{
		PK: 1,
		name: 'port-1',
		status: true
	},
	{
		PK: 2,
		name: 'port-1',
		status: true
	},
	{
		PK: 3,
		name: 'port-1',
		status: true
	},
	{
		PK: 4,
		name: 'port-1',
		status: true
	},
	{
		PK: 5,
		name: 'port-1',
		status: true
	},
	{
		PK: 6,
		name: 'port-1',
		status: true
	},
	{
		PK: 7,
		name: 'port-1',
		status: true
	},
	{
		PK: 8,
		name: 'port-1',
		status: true
	},
	{
		PK: 9,
		name: 'port-1',
		status: true
	},
	{
		PK: 10,
		name: 'port-1',
		status: true
	},
	{
		PK: 11,
		name: 'port-1',
		status: true
	}
];
