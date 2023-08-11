import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import userSchema, { User } from "../models/user";
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { count } from 'console';

dotenv.config({path:'./.env'});
const usersRouter = express.Router();

usersRouter.get(`/`, async (req: Request, res: Response): Promise<void> => {
    const userList = await User.find().select('name phone email');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});
usersRouter.get(`/allUsers`, async (req: Request, res: Response): Promise<void> => {
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(userList);
});
usersRouter.get('/:id', async(req: Request,res:Response)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})
usersRouter.post(`/`, async (req: Request, res: Response) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        street: req.body.street,
        passwordHash: bcrypt.hashSync(req.body.passwordHash,Number.parseInt(process.env.PASSWORD_HASH!)),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country
    })
    const addUser = await user.save();

    if(!user)
        return res.status(500).send('The user cannot be created!');
    
    res.status(201).json(addUser)
})

usersRouter.put('/:id', async (req, res) => {
    const userExit = await User.findById(req.params.id);
    let newPassword;
    if(req.body.password){
        newPassword = bcrypt.hashSync(req.body.password, process.env.PASSWORD_HASH);
    }else{
        newPassword = userExit?.passwordHash;
    }
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
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
        },
        { new: true }
    )

    if(!user)
        return res.status(400).send('The user cannot be created!');
    return res.status(200).send(user);
})
usersRouter.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user) {
            return res.status(200).json({
                success: true,
                message: 'The User is deleted!!!'
            })
        }else{
            return res.status(404).json({
                success: false,
                message: 'User not found!!!'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
})

usersRouter.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).send('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const secrect: string | undefined = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                userId: user.id,
                isAdmin: user.isAdmin, 
            },
            secrect!,
            {expiresIn: process.env.JWT_TIME_EXPIRES}
        );
        return res.status(200).send({user: user.email, token: token})
    }
    else
        return res.status(400).send('Password is wrong!')
})

usersRouter.post('/register', async (req, res)=>{
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.passwordHash,Number.parseInt(process.env.PASSWORD_HASH!)),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    const addUser = await user.save();
    if(!addUser){
        return res.status(400).send('The user cannot be created!');
    }
    res.status(201).send(addUser);
})

usersRouter.get('/get/count', async(req,res)=>{
    const userCount = await User.countDocuments()
                        .then((count:Number) => count)
                        .catch((error:Error)=>error)

    if(!userCount){
        res.status(500).json({success: false})
    }
    res.status(200).send({userCount: userCount});
})

export default usersRouter;