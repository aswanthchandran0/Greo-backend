
import mongoose, { Schema } from "mongoose";
import { RollCommentRepository } from "../repositories/rollCommentRepository";


export class RollGetComments{
    constructor(private rollCommentRepository:RollCommentRepository){}

   async execute(rollId:mongoose.Types.ObjectId){
    return await this.rollCommentRepository.findByRollId(rollId)  
}
}