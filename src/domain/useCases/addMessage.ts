import mongoose from "mongoose";
import { MessageRepository } from "../repositories/messageRepository";

export class AddMessage{
    constructor(private messageRepository:MessageRepository){}
  
    async execute(chatId:string,senderId:string,text:string):Promise<void>{
        await this.messageRepository.addMessage(chatId,senderId,text)
    }
}