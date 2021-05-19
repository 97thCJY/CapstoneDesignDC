import mongoose from "mongoose";

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
    status: {
        type: Number,
        default: 0,
        required: 'transaction status setting req'
    },
    createdAt: {
        type: Date,
        default: Date.now

    },
    description: {
        type: String,
        required: 'description value req'
    }
});

const model = mongoose.model("Transaction", TransactionSchema);


export default model;