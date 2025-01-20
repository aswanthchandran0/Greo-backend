import { EmailService } from "../../application/services/emailService";
import { OTP } from "../entities/otp";
import { OtpRepository } from "../repositories/otpRepository";
import { userRepository } from "../repositories/userRepository";


export class ResentOtp{ 
    constructor(
        private EmailService:EmailService,
        private otpRepository:OtpRepository,
        private userRepository:userRepository
    ){}

    async execute(email:string):Promise<void>{
        const user = await this.userRepository.findByEmail(email)
        if(!user) throw new Error('user not found')
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiresAt = new Date(Date.now() + 5*60*1000)
        const otp = new OTP (user.id,otpCode,expiresAt)
        await this.otpRepository.update(otp)
        await this.EmailService.sendOTPEmail(email,otpCode)
    }
}