import mongoose, { Document, Schema, Types } from "mongoose";
import { MediaType } from "../../../../domain/entities/post";
import { boolean } from "joi";

export interface IPost extends Document {
  id: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  mediaUrls: string[];
  mediaType: MediaType;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isBlocked:boolean
}

const postSchema: Schema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  mediaUrls: { type: [{ type: String }] },
  content: { type: String },
  isBlocked:{type:Boolean, default:false},
  createdAt: { type: Date, requierd: true, default: Date.now() },
});
  
export const PostModel = mongoose.model<IPost>("post", postSchema);
