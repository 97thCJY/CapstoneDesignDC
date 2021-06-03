var mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
	PK: {
		type: Number
	},
	port: {
		type: Number
	},
	name: {
		type: String
	},
	status: {
		type: Boolean,
		default: true,
		required: 'device status setting req'
	}
});

const model = mongoose.model('Device', DeviceSchema);

export default model;
