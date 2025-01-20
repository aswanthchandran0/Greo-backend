import { string } from "joi";
import mongoose, { Schema } from "mongoose";


export interface IrollModel{
    userId:string;
    thumbnail:string
    mediaUrl: string;
    content?: string;
    createdAt:Date
}

const rollSchema:Schema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    thumbnail:{type:String},
    mediaUrl: { type:String},
  content: { type: String },
  createdAt: { type: Date, requierd: true, default: Date.now },
})

export const RollModel = mongoose.model<IrollModel>("roll", rollSchema);