import mongoose from "mongoose";
import { PostRepository } from "../repositories/postRepository";

export class DeletePost {
    constructor(private postRepository:PostRepository){}

    async execute(postId:mongoose.Types.ObjectId):Promise<void>{
        await this.postRepository.deletePost(postId)
    }
}