import { OTP } from "../entities/otp";
import { Schema } from "mongoose";
export interface OtpRepository{
    save(otp:OTP):Promise<void>
    findByUserId(user_id:Schema.Types.ObjectId):Promise<OTP|null>
    deleteByUserId(user_id:Schema.Types.ObjectId):Promise<void>
}