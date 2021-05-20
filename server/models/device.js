import mongoose from "mongoose";

/// must Make Model (data)  Schema ( shape, format)


const DeviceSchema = new mongoose.Schema({

    PK: {
        type: Number,
        required: 'PK is required',
    },
    port: {
        type: Number,
    },
    name: {
        type: String
    },
    status:{
        type: Boolean,
        default: false,
        required: 'device status setting req'
    }
});

const model = mongoose.model("Device", DeviceSchema);


export default model;
