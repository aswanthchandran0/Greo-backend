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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepositoryImpl = void 0;
const chatModel_1 = require("../database/mongo/models/chatModel");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepositoryImpl {
    createChat(members) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const objectIdMembers = members.map((id) => new mongoose_1.default.Types.ObjectId(id)).sort();
                // Attempt to find chat with exact members
                let chat = yield chatModel_1.ChatModel.findOne({
                    members: { $all: objectIdMembers },
                }).session(session);
                if (!chat) {
                    // Create a new chat if none exists
                    chat = new chatModel_1.ChatModel({
                        members: objectIdMembers,
                        timeStamb: new Date(),
                    });
                    yield chat.save({ session });
                    console.log('New chat created:', chat);
                }
                else {
                    // If chat exists, update the timestamp
                    chat.timeStamb = new Date();
                    yield chat.save({ session });
                    console.log('Chat updated:', chat);
                }
                yield session.commitTransaction(); // Commit the transaction
                session.endSession(); // End session
                return {
                    id: String(chat._id),
                    members: chat.members,
                    timeStamb: chat.timeStamb,
                };
            }
            catch (err) {
                yield session.abortTransaction(); // Abort transaction in case of error
                session.endSession(); // End session
                console.log('Error while updating chat model', err);
                throw new Error('Failed to create or update chat');
            }
        });
    }
    userChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            userId = userId.toString();
            const chats = yield chatModel_1.ChatModel.find({
                members: { $in: [userId] },
            });
            return chats.map((chat) => ({
                id: String(chat._id),
                members: chat.members,
                timeStamb: chat.timeStamb,
            }));
        });
    }
    findChat(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('sender id in find chat', senderId, 'receiver id in ', receiverId);
            const Chat = yield chatModel_1.ChatModel.findOne({ members: { $all: [senderId, receiverId] } });
            if (!Chat) {
                return null;
            }
            return {
                id: String(Chat._id),
                members: Chat.members,
                timeStamb: Chat.timeStamb,
            };
        });
    }
}
exports.ChatRepositoryImpl = ChatRepositoryImpl;
