import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';

const PORT = process.env.PORT;

const portListener = () => console.log(`✅listening to PORT:: ${PORT} `);

app.listen(PORT, portListener);
