import mongoose, { Schema,Document } from "mongoose";

interface Ichat extends Document{
   members:Array<mongoose.Types.ObjectId>,
   timeStamb:Date
}

const ChatSchma = new Schema(
    {
   members:{type:Array},  
},{
    timestamps:true
}

)




export const ChatModel = mongoose.model<Ichat>('chat',ChatSchma)