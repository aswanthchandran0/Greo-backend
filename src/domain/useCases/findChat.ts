import mongoose from "mongoose";
import { ChatRepository } from "../repositories/chatRepository";
import { ChatDto } from "../../application/dto/chatDto";


export class FindChat{  
    constructor(private chatRepository:ChatRepository){}
 
    async execute(senderId:string,receiverId:string):Promise<ChatDto|null>{
        return await this.chatRepository.findChat(senderId,receiverId)
    }
}
