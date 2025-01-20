"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    // Create a new chat
    createChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const members = [req.body.senderId, req.body.receiverId];
                console.log('members', members);
                const chat = yield this.chatService.CreateChat(members);
                console.log('after chat response from service', chat);
                return res.status(201).json(chat);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating chat", error });
            }
        });
    }
    // Get all chats for a user
    getUserChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const chats = yield this.chatService.UserChats(userId);
                return res.status(200).json(chats);
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Error fetching user chats", error });
            }
        });
    }
    // Find chat between two users
    findChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = req.params;
                const chat = yield this.chatService.FindChat(senderId, receiverId);
                if (!chat) {
                    return res.status(404).json({ message: "Chat not found" });
                }
                return res.status(200).json(chat);
            }
            catch (error) {
                return res.status(500).json({ message: "Error finding chat", error });
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, text } = req.body;
                const message = yield this.chatService.AddMessage(chatId, senderId, text);
                console.log('latest message', message);
                return res.status(200).json(message);
            }
            catch (error) {
                console.log('error', error);
                return res.status(500).json({ message: "Error adding message", error });
            }
        });
    }
    getMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                console.log('chat id ', chatId);
                const messages = yield this.chatService.GetMessage(chatId);
                console.log('message in mesage', messages);
                return res.status(200).json(messages);
            }
            catch (error) {
                return res.status(500).json({ message: "Error fetching messages", error });
            }
        });
    }
}
exports.ChatController = ChatController;
