import mongoose from "mongoose";
import { messageModel } from "../database/mongo/models/MessageModel";
import { MessageRepository } from "../../domain/repositories/messageRepository";
import {  MessageDto } from "../../application/dto/chatDto";
export class MessagaeRepositoryImpl implements MessageRepository {

    public async addMessage(chatId: string, senderId:string, text: string): Promise<MessageDto> {
        console.log('chat id in add message',chatId)
        const message = new messageModel({
            chatId,
            senderId,
            text
        });
        await message.save();
      return message
    }
    
    public async getMessages(chatId: string): Promise<MessageDto[]> {
        const messages = await messageModel.find({chatId});
        
        return messages
    }
}