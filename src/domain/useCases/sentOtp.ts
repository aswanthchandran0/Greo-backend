import { OtpRepository } from "../repositories/otpRepository";
import { OTP } from "../entities/otp";
import { EmailService } from "../../application/services/emailService";
import { Schema } from "mongoose";
export class  SendOtp{
constructor(
    private otpRepository:OtpRepository,
    private emailService:EmailService
){}

async execute(user_id:Schema.Types.ObjectId,email:string):Promise<void>{
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5*60*1000)
    const otp = new OTP (user_id,otpCode,expiresAt)
    await this.otpRepository.save(otp)
    await this.emailService.sendOTPEmail(email,otpCode)
}
}