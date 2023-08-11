"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_1 = __importDefault(require("./routes/product"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
mongoose_1.default
    .connect('mongodb://localhost:27017', {
    dbName: 'MERN',
})
    .then(() => {
    console.log('database connection is ready');
})
    .catch((err) => {
    console.log(err);
});
app.use('/apiv1', product_1.default);
app.use('/apiv1', user_1.default);
app.listen(3000, () => {
    console.log('The server is running on port', 3000);
});
