import { Request,Response,NextFunction } from "express";
import tokenService from "../../application/services/tokenService";
import { JwtPayload } from "jsonwebtoken";



export const adminAuthenticateToken =(req:Request,res:Response,next:NextFunction)=>{
  console.log('request was reaching in there')
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
      return res.status(401).json({message:'Access token is missing or Invalid'})
    }
    try{
      const decoded = tokenService.verifyToken(token,true) as JwtPayload
      (req as any).user = decoded
      next()
    }catch(err){      
      return res.status(401).json({message:"Invalid or expired access token"})
    }
}


