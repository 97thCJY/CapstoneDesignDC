import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { breakSecurityPolicy, globalMiddleWare } from './middleware.js';
import routes from './routes';
import homeRouter from './router/homeRouter.js';
import transActionRouter from './router/transActionRouter';
import mainRouter from './router/mainRouter';

const app = express();

app.use(helmet());
app.use(breakSecurityPolicy);

app.set('view engine', 'pug');
app.set('views', './view');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use('*', globalMiddleWare);

app.use(routes.main, mainRouter);
app.use(routes.transAction, transActionRouter);
app.use(routes.home, homeRouter);

export default app;
