import mongoose from "mongoose";

export class OTP{
    constructor(
        public user_id:mongoose.Types.ObjectId,
        public otpCode:string,
        public expiresAt:Date
    ){}
}