import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config";
import { Schema } from "mongoose";
import { UserModel } from "../../infrastructure/database/mongo/models/userModel";
import { log } from "console";
import { AdminModel } from "../../infrastructure/database/mongo/models/adminModel";

class JWTService {
  generateAccessToken(userId: Schema.Types.ObjectId) {
    const Secret = config.JWT_SECRET as string
    return jwt.sign({ userId }, Secret, { expiresIn: '1d' })
  }

  generateAdminAccessToken(adminId: Schema.Types.ObjectId) {
    const Secret = config.JWT_SECRET as string
    return jwt.sign({ adminId }, Secret, { expiresIn: '1d' })
  }

  generateRefreshToken(userId: Schema.Types.ObjectId) {
    const Secret = config.JWT_REFRESH_SECRET as string
    return jwt.sign({ userId }, Secret, { expiresIn: '30d' })
  }

  async verifyToken(token: string, isRefreshToken = false) {

    try {
      const secret = isRefreshToken ? (config.JWT_REFRESH_SECRET as string) : (config.JWT_SECRET as string);
      const decodedToken = jwt.verify(token, secret) as JwtPayload;

      if (!decodedToken) throw new Error('Invalid token')
      const user = await UserModel.findOne({ _id: decodedToken.userId })
      if (!user) throw new Error('user not found')
      if (user.is_suspended) throw new Error('User suspended')

      return decodedToken
    } catch (error) {
      console.error('token verification failed:',(error as Error).message)
      throw error
    }
  }

  async  adminVerifyToken(token: string, isRefreshToken = false) {

    try {
      const secret = isRefreshToken ? (config.JWT_REFRESH_SECRET as string) : (config.JWT_SECRET as string);
      const decodedToken = jwt.verify(token, secret) as JwtPayload;
       const admin = await AdminModel.findOne({ _id: decodedToken.adminId })
       if(admin){
        return decodedToken
       }else{
        throw new Error('admin not found')
       }
    } catch (error) {
      console.error('token verification failed:',(error as Error).message)
      throw error
    }
  }




  refreshTokens(refreshToken: string) {
    const decodedToken = this.verifyToken(refreshToken, true)
    if (!decodedToken) throw new Error('Invalid refresh Token')
    const userId = (decodedToken as any).userId
    const accessToken = this.generateAccessToken(userId)
    const newRefreshToken = this.generateRefreshToken(userId)
    return { accessToken, refreshToken: newRefreshToken }
  }
}

export default new JWTService()