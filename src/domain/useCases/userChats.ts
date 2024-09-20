import mongoose from "mongoose";
import { ChatRepository } from "../repositories/chatRepository";
import { ChatDto } from "../../application/dto/chatDto";


export class UserChats{
    constructor(private chatRepository:ChatRepository){}
async execute(userId:string):Promise<ChatDto[]>{
    return await this.chatRepository.userChats(userId)
}

}