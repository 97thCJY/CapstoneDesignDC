import mongoose from 'mongoose';

/// must Make Model (data)  Schema ( shape, format)

const TransactionSchema = new mongoose.Schema({
	PK: {
		type: Number,
		required: ' PK is required'
	},
	seller: {
		type: Number,
		required: 'creater Id is required'
	},
	buyer: {
		type: Number
	},
	amount: {
		type: Number,
		default: 0,
		required: 'amount value req'
	},
	reqAmount: {
		type: Number,
		default: 0
	},
	status: {
		type: Number,
		default: 0,
		required: 'transaction status setting req'
	},
	createdAt: {
		type: Date
	},
	description: {
		type: String,
		required: 'description value req'
	},
	hash: {
		type: String,
		default: ''
	}
});

const model = mongoose.model('Transaction', TransactionSchema);

export default model;
