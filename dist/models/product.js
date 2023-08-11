"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    richDescription: {
        type: String,
        required: true
    }
});
productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
productSchema.set('toJSON', {
    virtuals: true
});
exports.Product = mongoose_1.default.model("Product", productSchema);
