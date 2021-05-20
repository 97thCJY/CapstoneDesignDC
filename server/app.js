import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import logger from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import { breakSecurityPolicy, globalMiddleWare } from './middleware.js';
import routes from './routes';
import homeRouter from './router/homeRouter.js';
import transActionRouter from './router/transActionRouter';
import mainRouter from './router/mainRouter';
import './passport.js';

const app = express();

const CookieStore = MongoStore(session);

app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.static('public'));
app.use('/static', express.static('static'));
app.use('/assets', express.static('assets'));
app.use(helmet());
app.use(breakSecurityPolicy);

app.set('view engine', 'pug');
app.set('views', './view');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use(
	session({
		secret: `tlzmflt`,
		resave: true,
		saveUninitialized: false,
		store: new CookieStore({ mongooseConnection: mongoose.connection })
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use('*', globalMiddleWare);

app.use(`/main${routes.transAction}`, transActionRouter);
app.use(routes.main, mainRouter);
app.use(routes.home, homeRouter);

export default app;
