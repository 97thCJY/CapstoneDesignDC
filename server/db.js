import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

const db = mongoose.connection;

const handleError = (error) => console.log(`❌ Error on connection '127.0.0.1: 27017' error = ${error}`);

const handleOpen = () => console.log(`✅ Connected to DB '127.0.0.1: 27017`);

db.once('open', handleOpen);

db.on('error', handleError);
