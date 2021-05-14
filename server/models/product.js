import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import userSchema from 'user.js';

const productSchema = new mongoose.Schema({
    product_id: { type: Number, unique: true, required: true },
    user_id: { type: Schema.ObjectId, ref: userSchema.user_id },
    product_name: { type: String, required: true },
    product_status: { type: Boolean, required: true },
    product_description: { type: String }
});


const model = mongoose.model('Product', ProductSchema);

export default model;