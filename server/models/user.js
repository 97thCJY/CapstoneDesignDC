import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
/// must Make Model (data)  Schema ( shape, format)

const UserSchema = new mongoose.Schema({
	PK: {
		type: Number,
		required: ' PK is required'
	},
	email: {
		type: String,
		required: 'Email is required'
	},
	password: {
		type: String,
		required: 'password required'
	},
	contact: {
		type: String
	},
	name: {
		type: String,
		required: 'user name required'
	},
	eUsage: {
		type: Number
	},
	eCharge: {
		type: Number
	},
	eSupply: {
		type: Number
	},
	batteryMax: {
		type: Number,
		required: 'Max battery value required'
	},
	IP: {
		type: String,
		required: 'ip required'
	},
	deviceList: {
		type: Array,
		default: [2, 3, 4, 5]
	}
});
UserSchema.plugin(passportLocalMongoose, {
	usernameField: 'email'
});

const model = mongoose.model('User', UserSchema);

export default model;
