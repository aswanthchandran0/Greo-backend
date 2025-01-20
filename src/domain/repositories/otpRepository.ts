import { OTP } from "../entities/otp";
import mongoose, { Schema } from "mongoose";
export interface OtpRepository{
    save(otp:OTP):Promise<void>
    update(otp:OTP):Promise<void>
    findByUserId(user_id:mongoose.Types.ObjectId):Promise<OTP|null>
    deleteByUserId(user_id:mongoose.Types.ObjectId):Promise<void>
}