import { Comment } from "../entities/comment"
import mongoose, { Schema } from "mongoose"
export interface CommentRepository{
    findByPostId(postId:mongoose.Types.ObjectId):Promise<Comment[] | null>
     save(userId:mongoose.Types.ObjectId,postId:mongoose.Types.ObjectId,content:string):Promise<Comment>
}