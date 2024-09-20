
import nodemailer from 'nodemailer'
import { config } from '../../config/config'

export class EmailService{
    async sendOTPEmail(email:string,otpCode:string):Promise<void>{
        const transporter = nodemailer.createTransport({
            service:config.MAIL_SERVICE,
            auth:{
                user:config.MAIL_SERVICE_USER,
                pass:config.MAIL_SERVICE_PASSWORD
            }

        })

        const mailOption ={
       from:config.MAIL_SERVICE_USER,
       to:email,
       subject:'Your OTP code',
       text:`Your OTP code is ${otpCode}. It will expire in 15 minutes.`
        }
        await transporter.sendMail(mailOption)
    }
}