
import nodemailer from 'nodemailer'
import { config } from '../../config/config'
import { formToJSON } from 'axios'

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

    async sendResetPasswordEmail(email:string,token:string):Promise<void>{
        const transporter = nodemailer.createTransport({
            service:config.MAIL_SERVICE,
            auth:{
                user:config.MAIL_SERVICE_USER,
                pass:config.MAIL_SERVICE_PASSWORD
            }
        })

        const mailOption = {
            form:config.MAIL_SERVICE_USER,
            to:email,
            subject:'Reset password',
            text:`Click here to reset your password: ${config.CLIENT_SIDE_URL}/auth/reset-password/${token}`
        }
        await transporter.sendMail(mailOption)
    }

    async sendAdminMail(email:string,subject:string,message:string):Promise<void>{
        const transporter = nodemailer.createTransport({
            service:config.MAIL_SERVICE,
            auth:{
                user:config.MAIL_SERVICE_USER,
                pass:config.MAIL_SERVICE_PASSWORD
            }

        })

        const mailOption = {
            from:config.MAIL_SERVICE_USER,
            to:email,
            subject:subject,
            text:message
        }
        await transporter.sendMail(mailOption)
        
    }

}