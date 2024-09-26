import { error } from "console";
import { ChatService } from "../../application/services/chatService";
import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";

export class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  // Create a new chat
  public async createChat(req: Request, res: Response): Promise<Response> {
    try {
      const  members  = []
      members.push(req.body.senderId,req.body.receiverId)
      
      const chat = await this.chatService.CreateChat(members);
      return res.status(201).json(chat);
    } catch (error) {
      return res.status(500).json({ message: "Error creating chat", error });
    }
  }

  // Get all chats for a user
  public async getUserChats(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.params.userId
      const chats = await this.chatService.UserChats(userId);
      return res.status(200).json(chats);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching user chats", error });
    }
  }

  // Find chat between two users
  public async findChat(req: Request, res: Response): Promise<Response> {
    try {
      const { senderId, receiverId } = req.params;
      const chat = await this.chatService.FindChat(
       senderId,
       receiverId
      );

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      return res.status(200).json(chat);
    } catch (error) {
      return res.status(500).json({ message: "Error finding chat", error });
    }
  }

  public async addMessage(req: Request, res: Response): Promise<Response> {
    try {
      const { chatId, senderId, text } = req.body;
     const message =   await this.chatService.AddMessage(
       chatId,
     senderId,
        text
      );
      console.log('latest message',message)
      return res.status(200).json(message);
    } catch (error) {
      console.log('error',error)
      return res.status(500).json({ message: "Error adding message", error });
    }
  }

  public async getMessage(req: Request, res: Response): Promise<Response> {
    try {
      const chatId = req.params.chatId;
      const messages = await this.chatService.GetMessage(chatId);
      return res.status(200).json(messages);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching messages", error });
    }
  }
}
