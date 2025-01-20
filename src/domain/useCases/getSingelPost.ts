import mongoose from "mongoose";
import { PostRepository } from "../repositories/postRepository";
import { SinglePost } from "../../application/dto/userDto";
import { IPost } from "../../infrastructure/database/mongo/models/postModel";

export class GetSingelPost {
    constructor(private postRepository:PostRepository){}

    async execute(postId:mongoose.Types.ObjectId,userId: mongoose.Types.ObjectId):Promise<IPost | null>{
        return await this.postRepository.getPost(postId,userId)
    }
}
