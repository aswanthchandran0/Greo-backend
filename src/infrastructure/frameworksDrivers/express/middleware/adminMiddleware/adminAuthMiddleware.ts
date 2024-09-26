import { Request,Response,NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import tokenService from "../../../../../application/services/tokenService";



export const adminAuthenticateToken = async (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(!token){
      console.log('request was reaching inside not token',token)
      return res.status(401).json({message:'Access token is missing or Invalid'})
    }
    try{
      const decoded = await  tokenService.adminVerifyToken(token,false) as JwtPayload
      (req as any).user = decoded
      next()
    }catch(err){ 
      console.log('error in authentication',err)     
      return res.status(401).json({message:"Invalid or expired access token"})
    }
}


