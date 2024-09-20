import mongoose from "mongoose";
import { ChatRepository } from "../repositories/chatRepository";
import { ChatDto } from "../../application/dto/chatDto";


export class CreateChat{

    constructor(private chatRepository:ChatRepository){}

    async execute(members:Array<mongoose.Types.ObjectId>):Promise<ChatDto>{
        return await this.chatRepository.createChat(members)
    }
}