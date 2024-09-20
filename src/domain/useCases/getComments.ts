import { CommentRepository } from "../repositories/commentRepository";
import mongoose, { Schema } from "mongoose";


export class GetComments{
    constructor(private commentRepository:CommentRepository){}

   async execute(postId:mongoose.Types.ObjectId){
    return await this.commentRepository.findByPostId(postId)  
}
}