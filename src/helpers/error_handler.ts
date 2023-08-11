import {Request,Response,NextFunction} from 'express';

export const errorHandle= (err:Error, req:Request, res:Response, next:NextFunction) =>{
    if (err.name === "UnauthorizedError"){
        return res.status(401).json({message:"The user is unauthorized"})
    }
    if (err.name === "ValidationError"){
        return res.status(401).json({message:err})
    }
    next();
    return res.status(500).json(err);
}