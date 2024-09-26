import mongoose from "mongoose";
import { MessageRepository } from "../repositories/messageRepository";
import { MessageDto } from "../../application/dto/chatDto";

export class AddMessage{
    constructor(private messageRepository:MessageRepository){}
  
    async execute(chatId:string,senderId:string,text:string):Promise<MessageDto>{
      return  await this.messageRepository.addMessage(chatId,senderId,text)
    }
}