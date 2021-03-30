import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { breakSecurityPolicy } from './middleware.js';
import routes from './routes';
import homeRouter from './router/homeRouter.js';

const app = express();

app.use(helmet());
app.use(breakSecurityPolicy);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));

app.use(routes.home, homeRouter);

export default app;
