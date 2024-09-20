import jwt, { JwtPayload }  from "jsonwebtoken";
import { config } from "../../config/config";
import { Schema } from "mongoose";

class JWTService{
  generateAccessToken(userId:Schema.Types.ObjectId){
    const Secret = config.JWT_SECRET as string
    return jwt.sign({userId},Secret,{expiresIn:'1d'})
  }

  generateAdminAccessToken(adminId:Schema.Types.ObjectId){
     const Secret = config.JWT_SECRET as string
     return jwt.sign({adminId},Secret,{expiresIn:'1d'})
  }

  generateRefreshToken(userId:Schema.Types.ObjectId){
    const Secret = config.JWT_REFRESH_SECRET as string
    return jwt.sign({userId},Secret,{expiresIn:'30d'})
  }

  verifyToken(token:string,isRefreshToken = false){
    const secret = isRefreshToken ? (config.JWT_REFRESH_SECRET as string) : (config.JWT_SECRET as string);
        return jwt.verify(token, secret) as JwtPayload;
  }


  refreshTokens(refreshToken:string){
         const decodedToken = this.verifyToken(refreshToken,true)
       if(!decodedToken) throw new Error('Invalid refresh Token')
        const userId = (decodedToken as any).userId
      const accessToken = this.generateAccessToken(userId)
      const newRefreshToken = this.generateRefreshToken(userId)
      return {accessToken,refreshToken:newRefreshToken}
  }
}

export default new JWTService()