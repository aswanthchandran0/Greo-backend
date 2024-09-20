import { Router } from "express";
import { ChatController } from "../controllers/chatController";
import { ChatService } from "../../application/services/chatService";
import { CreateChat } from "../../domain/useCases/createChat";
import { FindChat } from "../../domain/useCases/findChat";
import { UserChats } from "../../domain/useCases/userChats";
import { AddMessage } from "../../domain/useCases/addMessage";
import { GetMessage } from "../../domain/useCases/getMessage";
import { ChatRepositoryImpl } from "../../infrastructure/repositoryImpl/chatRepositoryImpl";
import { MessagaeRepositoryImpl } from "../../infrastructure/repositoryImpl/messageRepositoryImpl";


// Create necessary instances
const chatRepository = new ChatRepositoryImpl();
const messageRepository = new MessagaeRepositoryImpl()
const createChatUseCase = new CreateChat(chatRepository);
const findChatUseCase = new FindChat(chatRepository);
const userChatsUseCase = new UserChats(chatRepository);
const addMessageUseCase = new AddMessage(messageRepository);
const getMessageUseCase = new GetMessage(messageRepository);
const chatService = new ChatService(createChatUseCase, findChatUseCase, userChatsUseCase,addMessageUseCase,getMessageUseCase);
const chatController = new ChatController(chatService);



// Define routes
 const router = Router();



router.post('/',  chatController.createChat.bind(chatController));  
router.get('/:userId', chatController.getUserChats.bind(chatController));  
router.get('/find/:senderId/:receiverId', chatController.findChat.bind(chatController));    
router.get('/m/:chatId', chatController.getMessage.bind(chatController)); 
router.post('/m', chatController.addMessage.bind(chatController));
export default router;