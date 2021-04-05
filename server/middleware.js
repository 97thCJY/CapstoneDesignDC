import routes from './routes.js';
import { onAuthenticatedId, notAuthenticatedId } from './fakeDB.js';




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
		res.redirect(routes.home);
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
		res.redirect(routes.home);
	}

	next();
};
