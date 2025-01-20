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
exports.MessagaeRepositoryImpl = void 0;
const MessageModel_1 = require("../database/mongo/models/MessageModel");
class MessagaeRepositoryImpl {
    addMessage(chatId, senderId, text) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('chat id in add message', chatId);
            const message = new MessageModel_1.messageModel({
                chatId,
                senderId,
                text
            });
            yield message.save();
            return message;
        });
    }
    getMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield MessageModel_1.messageModel.find({ chatId });
            return messages;
        });
    }
}
exports.MessagaeRepositoryImpl = MessagaeRepositoryImpl;
