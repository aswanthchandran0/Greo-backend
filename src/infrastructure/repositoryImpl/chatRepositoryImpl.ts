import { Schema } from "mongoose";
import { Types } from "mongoose";

import { ChatRepository } from "../../domain/repositories/chatRepository";
import { ChatModel } from "../database/mongo/models/chatModel";
import mongoose from "mongoose";
import { ChatDto } from "../../application/dto/chatDto";

export class ChatRepositoryImpl implements ChatRepository {
  public async createChat(members: Array<Types.ObjectId>): Promise<ChatDto> {
    const chat = new ChatModel({
      members,
      timeStamb: new Date(),
    });
    const savedChat = await chat.save();
    return {
      id: String(savedChat._id),
      members: savedChat.members,
      timeStamb: savedChat.timeStamb,
    };
  }

  public async userChats(userId:string): Promise<ChatDto[]> {
    console.log('user di in user chat and type',userId,typeof userId)
    const chats = await ChatModel.find({
      members: { $in: [userId] },
    });
    return chats.map((chat) => ({
      id: String(chat._id),
      members: chat.members,
      timeStamb: chat.timeStamb,
    }));
  }

  public async findChat(senderId:string, receiverId:string): Promise<ChatDto|null> {
    console.log('sender id in find chat',senderId,'receiver id in ',receiverId)
      const Chat = await ChatModel.findOne({members:{$all:[senderId,receiverId]}})
      if(!Chat){
        return null
      }
      return {
        id: String(Chat._id),
        members: Chat.members,
        timeStamb: Chat.timeStamb,  
      }
  }
}
