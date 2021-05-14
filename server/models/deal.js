import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import userSchema from 'user.js';

const dealschema = new mongoose.Schema({
    deal_id: { type: Number, unique: true, index: true },
    deal_seller_id: { type: ObjectId, ref: userSchema.user_id },
    deal_buyer_id: { type: Number, required: true },
    deal_amount: { type: Number, required: true },
    deal_status: { type: Boolean, reuired: true },
    created_date: { type: Date, default: Date.now },
    deal_description: { type: String }
});


const model = mongoose.model('Deal', DealSchema);

export default model;