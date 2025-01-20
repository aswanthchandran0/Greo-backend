import mongoose  from "mongoose";
import { PostRepository } from "../repositories/postRepository";

export class UpdatePost{
   constructor(private postRepository:PostRepository){}

   async execute(userId:mongoose.Types.ObjectId,postId:mongoose.Types.ObjectId,content:string): Promise<void> {
      return await this.postRepository.updatePost(userId,postId,content)
   }
}