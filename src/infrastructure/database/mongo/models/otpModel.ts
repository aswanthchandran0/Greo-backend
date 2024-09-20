import mongoose,{Document,Schema} from "mongoose";


interface IOtp extends   Document{
    user_id:Schema.Types.ObjectId,
    otpCode:string,
    expiresAt:Date
}


const  OtpSchema:Schema = new Schema({
    user_id:{type:Schema.Types.ObjectId,required:true,unique:true},
    otpCode:{type:String,required:true,unique:true},
    expiresAt:{type:Date,required:true}
})


export const OtpModel = mongoose.model<IOtp>('OTP',OtpSchema)

