import { Request, Response, NextFunction } from "express";
import tokenService from "../../../../../application/services/tokenService";
import { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../../../../database/mongo/models/userModel";


export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or Invalid' })
  }
  try {
    //verify the token
    const decoded = await tokenService.verifyToken(token) as JwtPayload
    (req as any).user = decoded

    next()
  } catch (error) {
    console.log('error in authentication',error)
    if((error as Error).message === 'User suspended'){
    return res.status(403).json({message:'User is suspended',clearToken:true})
    }
    return res.status(401).json({ message: "Invalid or expired access token" })
  }
}