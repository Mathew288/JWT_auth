import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    street?: string;
    apartment?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    isAdmin: boolean;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    street: {
        type: String,
        default: ''
    },
    apartment: {
        type: String,
        default: ''
    },
    zip: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    country: {
        type: String,
        default: ''
    }
})

userSchema.virtual('id').get(function(this: Document) {
    return this._id.toHexString();
})

userSchema.set('toJSON', {
    virtuals: true,
})

export const User: Model<IUser> = mongoose.model('User', userSchema);
export default userSchema;