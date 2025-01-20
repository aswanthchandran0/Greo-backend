import express, { Request, Response, NextFunction } from 'express';
import { authenticateToken } from "../userMiddleware/authMiddleware"
import { adminAuthenticateToken } from "./adminAuthMiddleware"

export const roleBasedAuthentication = (req:Request,res:Response,next:NextFunction)=>{
    authenticateToken(req,res,(err:any)=>{
        if(err){
            console.log('error',err)
            return adminAuthenticateToken(req,res,next)
        }
        next()
    })
}