import { Schema } from "mongoose";
import { Types } from "mongoose";

import { ChatRepository } from "../../domain/repositories/chatRepository";
import { ChatModel } from "../database/mongo/models/chatModel";
import mongoose from "mongoose";
import { ChatDto } from "../../application/dto/chatDto";

export class ChatRepositoryImpl implements ChatRepository {
  public async createChat(members: Array<mongoose.Types.ObjectId>): Promise<ChatDto> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const objectIdMembers = members.map((id) => new mongoose.Types.ObjectId(id)).sort();

      // Attempt to find chat with exact members
      let chat = await ChatModel.findOne({
        members: { $all: objectIdMembers },
      }).session(session);

      if (!chat) {
        // Create a new chat if none exists
        chat = new ChatModel({
          members: objectIdMembers,
          timeStamb: new Date(),
        });
        await chat.save({ session });
        console.log('New chat created:', chat);
      } else {
        // If chat exists, update the timestamp
        chat.timeStamb = new Date();
        await chat.save({ session });
        console.log('Chat updated:', chat);
      }

      await session.commitTransaction();  // Commit the transaction
      session.endSession(); // End session

      return {
        id: String(chat._id),
        members: chat.members,
        timeStamb: chat.timeStamb,
      };
    } catch (err) {
      await session.abortTransaction();  // Abort transaction in case of error
      session.endSession(); // End session
      console.log('Error while updating chat model', err);
      throw new Error('Failed to create or update chat');
    }
  }
  
  public async userChats(userId:string): Promise<ChatDto[]> {
    userId  = userId.toString()
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
