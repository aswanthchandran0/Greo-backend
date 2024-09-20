import { Schema } from "mongoose";

export class OTP{
    constructor(
        public userId:Schema.Types.ObjectId,
        public otpCode:string,
        public expiresAt:Date
    ){}
}