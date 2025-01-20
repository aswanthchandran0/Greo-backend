import { boolean, required } from "joi";
import mongoose, { Schema } from "mongoose";


interface INotification extends Document {
    userId:mongoose.Types.ObjectId,
    initiatorId:mongoose.Types.ObjectId,
    mediaUrl?:string,
    entityId:mongoose.Types.ObjectId
    message:string,
    type:string,
    isRead:boolean
    createdAt:Date
    
}

const NotificationSchema = new mongoose.Schema(
   {
     userId: { type: Schema.Types.ObjectId, required: true },
    initiatorId: { type: Schema.Types.ObjectId, required: true },
    mediaUrl:{type:String},
    entityId:{type:Schema.Types.ObjectId, required:true},
    message:{type:String},
    type:{type:String},
    isRead:{type:Boolean , default:false},
    createdAt:{type:Date, default:Date.now}
}
)

export const NotificationModel = mongoose.model<INotification>("notification",NotificationSchema)