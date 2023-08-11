import mongoose, {Schema,Document, Model} from 'mongoose';

interface IProdut extends Document{
    name:string;
    description:string;
    richDescription:string;
}

const productSchema:Schema<IProdut> = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    richDescription:{
        type:String,
        required:true
    }
})
productSchema.virtual('id').get(function (this:Document) {
    return this._id.toHexString();
})

productSchema.set('toJSON',{
    virtuals:true
});

export const Product: Model<IProdut> = mongoose.model("Product", productSchema);