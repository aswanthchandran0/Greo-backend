import { Post } from "../entities/post";
import { PostModel } from "../../infrastructure/database/mongo/models/postModel";
import { PostRepository } from "../repositories/postRepository";
import { UserProfileModel } from "../../infrastructure/database/mongo/userProfileModel";
import  Mongoose  from "mongoose";

export class GetPosts{
    constructor(private postRepository:PostRepository){}
    async execute(ObjectUserId:Mongoose.Types.ObjectId){
       const posts = await this.postRepository.getPostsWithDetails(ObjectUserId)
       return posts
    }
}