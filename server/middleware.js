import routes from './routes.js';
import multer from 'multer';
import { onAuthenticatedId, notAuthenticatedId } from './fakeDB.js';

export const globalMiddleWare = (req, res, next) => {
    res.locals.routes = routes;
    res.locals.siteName = 'CapstonePJ';
    res.locals.PKN = 0;
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
    console.log(req.user);
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