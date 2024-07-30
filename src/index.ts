import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())




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
