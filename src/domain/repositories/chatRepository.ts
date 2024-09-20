import mongoose, { Schema } from "mongoose";
import { ChatDto } from "../../application/dto/chatDto";

export interface ChatRepository{
   createChat(members:Array<mongoose.Types.ObjectId>):Promise<ChatDto>
   userChats(userId:string):Promise<ChatDto[]>
   findChat(senderId:string,receiverId:string):Promise<ChatDto|null>
}