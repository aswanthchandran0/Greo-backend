import express, { urlencoded } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './presentation/routes/userRoutes'
dotenv.config()

const app = express()
 
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//routes
app.use('/api',userRoutes)


mongoose.connect(process.env.MONGO_URI || '',{
}).then(()=>{
    console.log('mongodb is connected')
}).catch((err)=>{
    console.log('failed to connect to mongodb',err)
})


const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log('server is running')
})
