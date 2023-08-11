import express,{Request, Response} from 'express';

import {Product} from '../models/product'
import mongoose from 'mongoose'

const router = express.Router();

router.get("/products",async (req:Request,res:Response) => {
    const productList = await Product.find().populate("");

    if (!productList) {
        res.status(500).json({
            "error":"error getting products"
        })
    }
    res.json(productList)
})

router.post("/products", async (req:Request,res:Response)=>{
    const newProduct = await Product.create(req.body);

    res.status(201).json(newProduct);
    

});

export default router;