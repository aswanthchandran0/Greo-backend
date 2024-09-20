import mongoose from "mongoose";
import { MessageRepository } from "../repositories/messageRepository";
import { MessageDto } from "../../application/dto/chatDto";

export class GetMessage {
    constructor(private messageRepository: MessageRepository) {}

 async execute(chatId: string): Promise<MessageDto[]> {
    return await this.messageRepository.getMessages(chatId);
 }
}