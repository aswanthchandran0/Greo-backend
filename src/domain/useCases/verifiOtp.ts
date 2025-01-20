import mongoose, { Schema } from "mongoose";
import { OtpRepository } from "../repositories/otpRepository";
import { userRepository } from "../repositories/userRepository";
export class VerifyOtp{
    constructor(
        private otpRepository:OtpRepository,
        private userRepository:userRepository
    
    ){}
    async execute(user_id:mongoose.Types.ObjectId,otpCode:string):Promise<boolean>{
        const otp = await this.otpRepository.findByUserId(user_id)
        if(otp && otp.otpCode == otpCode && otp.expiresAt>new Date()){
            
            await this.otpRepository.deleteByUserId(user_id)
            await this.userRepository.updateUser(user_id,{is_verified:true})
            return true
        }else if(otp && otp.expiresAt<new Date()){
            await this.otpRepository.deleteByUserId(user_id)
            return false
        }
        return false
    }
}