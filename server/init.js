import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import './db';

const PORT = process.env.PORT || 3000;

const portListener = () => console.log(`✅listening to PORT:: ${PORT} `);

app.listen(PORT, portListener);
