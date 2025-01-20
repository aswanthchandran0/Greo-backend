import mongoose from "mongoose";
import { ReasonType } from "../../infrastructure/database/mongo/models/postReportModel";
import { PostRepository } from "../repositories/postRepository";


export class ReportPost{
    constructor(private postRepository:PostRepository){}

    async execute(postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, reason:ReasonType){
        return await this.postRepository.reportPost(postId,userId,reason)
    }
}