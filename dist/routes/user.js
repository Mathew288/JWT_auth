"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: './.env' });
const usersRouter = express_1.default.Router();
usersRouter.get(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userList = yield user_1.User.find().select('name phone email');
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(userList);
}));
usersRouter.get(`/allUsers`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userList = yield user_1.User.find();
    if (!userList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send(userList);
}));
usersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.params.id).select('-passwordHash');
    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' });
    }
    res.status(200).send(user);
}));
usersRouter.post(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: bcryptjs_1.default.hashSync(req.body.passwordHash, Number.parseInt(process.env.PASSWORD_HASH)),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    });
    const addUser = yield user.save();
    if (!user)
        return res.status(500).send('The user cannot be created!');
    res.status(201).json(addUser);
}));
usersRouter.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userExit = yield user_1.User.findById(req.params.id);
    let newPassword;
    if (req.body.password) {
        newPassword = bcryptjs_1.default.hashSync(req.body.password, process.env.PASSWORD_HASH);
    }
    else {
        newPassword = userExit === null || userExit === void 0 ? void 0 : userExit.passwordHash;
    }
    const user = yield user_1.User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        passwordHash: newPassword,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    }, { new: true });
    if (!user)
        return res.status(400).send('The user cannot be created!');
    return res.status(200).send(user);
}));
usersRouter.delete('/:id', (req, res) => {
    user_1.User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({
                success: true,
                message: 'The User is deleted!!!'
            });
        }
        else {
            return res.status(404).json({
                success: false,
                message: 'User not found!!!'
            });
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        });
    });
});
usersRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send('The user not found');
    }
    if (user && bcryptjs_1.default.compareSync(req.body.password, user.passwordHash)) {
        const secrect = process.env.JWT_SECRET;
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            isAdmin: user.isAdmin,
        }, secrect, { expiresIn: process.env.JWT_TIME_EXPIRES });
        return res.status(200).send({ user: user.email, token: token });
    }
    else
        return res.status(400).send('Password is wrong!');
}));
usersRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcryptjs_1.default.hashSync(req.body.passwordHash, Number.parseInt(process.env.PASSWORD_HASH)),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    });
    const addUser = yield user.save();
    if (!addUser) {
        return res.status(400).send('The user cannot be created!');
    }
    res.status(201).send(addUser);
}));
usersRouter.get('/get/count', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userCount = yield user_1.User.countDocuments()
        .then((count) => count)
        .catch((error) => error);
    if (!userCount) {
        res.status(500).json({ success: false });
    }
    res.status(200).send({ userCount: userCount });
}));
exports.default = usersRouter;
