import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import userRoutes from './presentation/routes/userRoutes'
import adminRoutes from './presentation/routes/adminRoutes'
import { config } from './config/config'
import morgan from 'morgan'
import cors from 'cors'
import { ChatRepositoryImpl } from './infrastructure/repositoryImpl/chatRepositoryImpl'
import { ChatService } from './application/services/chatService'
import { SendMessage } from './domain/useCases/sendMessage'
import { ChatController } from './presentation/controllers/chatController'
import  chatRoutes  from './presentation/routes/chatRoutes'

// Initialize Express app
const app = express()
   
// CORS Options
const corsOptions = {
    origin: config.CLIENT_SIDE_URL,
    methods: 'GET,PATCH,POST,PUT,DELETE,OPTIONS',
    allowedHeaders:['content-Type','Authorization','Origin','X-Requested-With','Accept'],

}
//middlewares
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))  
//routes
    

// Database connection
mongoose.connect(config.MONGO_URI || '',{
}).then(()=>{
    console.log('mongodb is connected')
}).catch((err)=>{
    console.log('failed to connect to mongodb',err)
})


// Dependency Injection Setup
const ChatRepository= new ChatRepositoryImpl()
//Routes
app.use('/api',userRoutes)
app.use('/api/admin',adminRoutes) 
app.use('/api/chat',chatRoutes)

//Initialize socket io


// CORS pre-flight
app.options('*', cors(corsOptions))
 


// Starting the server
const PORT = config.PORT || 3000
const server = app.listen(PORT,()=>{
    console.log('server is running')
})
