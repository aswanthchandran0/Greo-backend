import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import userRoutes from './presentation/routes/userRoutes'
import adminRoutes from './presentation/routes/adminRoutes'
import { config } from './config/config'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
// import { ChatRepositoryImpl } from './infrastructure/repositoryImpl/chatRepositoryImpl'
// import { ChatService } from './application/services/chatService'
// import { SendMessage } from './domain/useCases/sendMessage'
// import { ChatController } from './presentation/controllers/chatController'
import  chatRoutes  from './presentation/routes/chatRoutes'

// Initialize Express app
const app = express()
const port =process.env.PORT
const url =process.env.URL
// socket server initialzation
const server = http.createServer(app)



// for handling multiple origins
const allowedOrigins: string[] = []
if(config.CLIENT_SIDE_URL)allowedOrigins.push(config.CLIENT_SIDE_URL)
if(config.PRODUCTION_CLIENT_SIDE_URL)allowedOrigins.push(config.PRODUCTION_CLIENT_SIDE_URL)
if(config.PRODUCTION_CLIENT_SIDE_WWW_URL)allowedOrigins.push(config.PRODUCTION_CLIENT_SIDE_WWW_URL)

// CORS Options
const corsOptions = {
    origin:   allowedOrigins.length > 0 ? allowedOrigins : [],
    methods: 'GET,PATCH,POST,PUT,DELETE,OPTIONS',
    allowedHeaders:['content-Type','Authorization','Origin','X-Requested-With','Accept'],
    credentials: true, 
    optionsSuccessStatus: 204

}
//middlewares
app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
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
// const ChatRepository= new ChatRepositoryImpl()
//Routes
app.use('/api',userRoutes)
app.use('/api/admin',adminRoutes) 
app.use('/api/chat',chatRoutes)

//Initialize socket io


// CORS pre-flight
app.options('*', cors(corsOptions))
 

// Error handling middleware


// Starting the server

server.listen(port, () => {
    console.log(`Server is running at ${url}:${port}`);
  });