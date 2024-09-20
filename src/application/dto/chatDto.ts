import mongoose from "mongoose"

export interface ChatDto{
    id:string
    members:Array<mongoose.Types.ObjectId>
    timeStamb:Date
}

export interface MessageDto{
    chatId:mongoose.Types.ObjectId
    senderId:mongoose.Types.ObjectId
    text:string
}