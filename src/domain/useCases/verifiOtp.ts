import { Schema } from "mongoose";
import { OtpRepository } from "../repositories/otpRepository";
export class VerifyOtp{
    constructor(private otpRepository:OtpRepository){}
    async execute(user_id:Schema.Types.ObjectId,otpCode:string):Promise<boolean>{
        const otp = await this.otpRepository.findByUserId(user_id)
        if(otp && otp.otpCode == otpCode && otp.expiresAt>new Date()){
            
            await this.otpRepository.deleteByUserId(user_id)
            return true
        }
        return false
    }
}