import mongoose from "mongoose";
import { MessageDto } from "../../application/dto/chatDto";

export interface MessageRepository{
    addMessage(chatId:string,senderId:string,text:string):Promise<MessageDto>
    getMessages(chatId:string):Promise<MessageDto[]>
}