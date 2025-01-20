import { userRepository } from "../repositories/userRepository";
import tokenService from "../../application/services/tokenService";
import { EmailService } from "../../application/services/emailService";
export class GenerateForgotPasswordToken{
    constructor(private userRepository:userRepository,
        private EmailService:EmailService
    ){}
    async execute(email:string){
    const user = await this.userRepository.findByEmail(email)
    if(!user) throw new Error('user not exist.')
        const ResetToken = await tokenService.generateResetPasswordToken(user.id)
        if(!ResetToken) throw new Error('something went wrong')
        await this.EmailService.sendResetPasswordEmail(email,ResetToken) 
    }
}