import mongoose, { mongo, Schema } from "mongoose";
import { CreateChat } from "../../domain/useCases/createChat";
import { FindChat } from "../../domain/useCases/findChat";
import { UserChats } from "../../domain/useCases/userChats";
import { GetMessage } from "../../domain/useCases/getMessage";
import { AddMessage } from "../../domain/useCases/addMessage";
import { ChatDto, MessageDto } from "../dto/chatDto";export class ChatService{
  private createChat: CreateChat
  private findChat: FindChat
  private userChats: UserChats
  private addMessage: AddMessage
  private getMessage: GetMessage
   constructor(
    createChat: CreateChat,
    findChat: FindChat,
    userChats: UserChats,
    addMessage: AddMessage, 
    getMessage: GetMessage
   ){
    this.createChat = createChat;
        this.findChat = findChat;
        this.userChats = userChats;
        this.addMessage = addMessage;
        this.getMessage = getMessage;

   }

   public async CreateChat(members:Array<mongoose.Types.ObjectId>):Promise<ChatDto>{
    return await this.createChat.execute(members);
   }

   public async UserChats(userId:string):Promise<ChatDto[]>{
    return await this.userChats.execute(userId);

   }

   public async FindChat(senderId:string,receiverId:string):Promise<ChatDto|null>{
    return await this.findChat.execute(senderId, receiverId);

   }

   public async AddMessage(chatId:string, senderId:string, text: string):Promise<MessageDto>{
    console.log('chat service',chatId,senderId,text)
    return await this.addMessage.execute(chatId, senderId, text);
   }

   public async GetMessage(chatId:string):Promise<MessageDto[]>{
    return await this.getMessage.execute(chatId);
   }
   
}