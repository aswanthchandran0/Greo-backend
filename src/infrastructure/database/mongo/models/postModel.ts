import mongoose,{Document,Schema, Types} from "mongoose";
import { MediaType } from "../../../../domain/entities/post";

export interface IPost extends Document{
    id:Schema.Types.ObjectId,
    userId:Schema.Types.ObjectId,
    mediaUrls:string[],
    mediaType:MediaType,
    content:string,
    createdAt:Date,
    updatedAt:Date
}


const postSchema:Schema = new mongoose.Schema({
   userId:{type:Schema.Types.ObjectId,required:true},
   mediaUrls:{type:[{type:String}]},
   content:{type:String},
   createdAt:{type:Date,requierd:true,default:Date.now()},
   updatedAt:{type:Date,required:true,default:Date.now()}
})

export const PostModel = mongoose.model<IPost>('post',postSchema)
