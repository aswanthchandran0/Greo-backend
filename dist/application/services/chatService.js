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
exports.ChatService = void 0;
class ChatService {
    constructor(createChat, findChat, userChats, addMessage, getMessage) {
        this.createChat = createChat;
        this.findChat = findChat;
        this.userChats = userChats;
        this.addMessage = addMessage;
        this.getMessage = getMessage;
    }
    CreateChat(members) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.createChat.execute(members);
        });
    }
    UserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userChats.execute(userId);
        });
    }
    FindChat(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findChat.execute(senderId, receiverId);
        });
    }
    AddMessage(chatId, senderId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('chat service', chatId, senderId, text);
            return yield this.addMessage.execute(chatId, senderId, text);
        });
    }
    GetMessage(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getMessage.execute(chatId);
        });
    }
}
exports.ChatService = ChatService;
