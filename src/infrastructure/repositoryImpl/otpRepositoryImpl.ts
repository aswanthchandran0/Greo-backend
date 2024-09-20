import { OTP } from "../../domain/entities/otp";
import { OtpRepository } from "../../domain/repositories/otpRepository";
import { OtpModel } from "../database/mongo/models/otpModel";
import { Schema } from "mongoose";

export class OtpRepositoryImpl  implements OtpRepository{
    async save(otp:OTP):Promise<void>{
        const  otpModel = new OtpModel(otp)
        await otpModel.save()
    }
    async findByUserId(user_id: Schema.Types.ObjectId): Promise<OTP | null> {
        const otpModel = await OtpModel.findOne({user_id}).exec()
        return otpModel ? new OTP(otpModel.user_id,otpModel.otpCode,otpModel.expiresAt):null
    }
    async deleteByUserId(user_id: Schema.Types.ObjectId): Promise<void> {
        await OtpModel.deleteOne({user_id}).exec()
    }
}