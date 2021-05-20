var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

const DeviceSchema = new mongoose.Schema({
    PK: {
        type: Number
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

DeviceSchema.plugin(autoIncrement.plugin, {
    model: 'Device',
    field: 'PK',
    startAt: 1, //시작
    increment : 1 // 증가
});

const model = mongoose.model("Device", DeviceSchema);

export default model;
