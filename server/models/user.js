import mongoose from "mongoose";

/// must Make Model (data)  Schema ( shape, format)


const UserSchema = new mongoose.Schema({

    PK: {
        type: Number,
        required: ' PK is required'
    },
    userEmail: {
        type: String,
        required: 'Email is required'
    },
    userPW:{
        type:String,
        required: 'password required'
    },
    contact:{
        type: String
    },
    userName:{
        type:String,
        required: 'user name required'
    },
    eUsage:{
        type: Number,
    },
    eCharge:{
        type:Number,
    },
    eSupply:{
        type: Number
    },
    batteryMax:{
        type: Number,
        required: 'Max battery value required'
    },
    IP:{
        type:String,
        required: 'ip required'
    }

});

const model = mongoose.model("User",UserSchema);


export default model;
