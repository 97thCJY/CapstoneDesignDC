import routes from './routes';

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
