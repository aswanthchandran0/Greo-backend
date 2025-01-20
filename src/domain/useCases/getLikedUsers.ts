import mongoose from "mongoose";
import { LikeRepository } from "../repositories/likeRepository";


export class GetLikedUsers{
    constructor(private likeRepository:LikeRepository){}

    async execute(postId:mongoose.Types.ObjectId){
        return await this.likeRepository.getLikedUsers(postId)
    }
}