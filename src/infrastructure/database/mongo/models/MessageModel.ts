import { timeStamp } from "console";
import mongoose, { Schema, Document, Model } from "mongoose";

interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new Schema({
   chatId:{type:Schema.Types.ObjectId},
    senderId: { type: Schema.Types.ObjectId },
    text: { type: String } 
},{
    timestamps: true
});


export  const messageModel = mongoose.model<IMessage>('Message', messageSchema)