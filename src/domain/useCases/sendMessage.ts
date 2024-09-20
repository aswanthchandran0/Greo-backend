import { ChatService } from "../../application/services/chatService";
import { ChatDto } from "../../application/dto/chatDto";

export class SendMessage{
    private chatService:ChatService
    constructor(chatService:ChatService){
        this.chatService = chatService
    }

    public async execute(messageData:ChatDto){
        await this.chatService.sendMessage(messageData)
    }
}