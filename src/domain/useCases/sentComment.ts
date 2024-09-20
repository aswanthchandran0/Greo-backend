import { Comment } from "../entities/comment"
import { CommentRepository } from "../repositories/commentRepository"
import mongoose from "mongoose"
export class SentComment{

    constructor(private commentRepository: CommentRepository){}
    async execute(postId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, content: string): Promise<Comment> {
      const savedComment =  await this.commentRepository.save(new mongoose.Types.ObjectId(userId), new mongoose.Types.ObjectId(postId),content)
     return savedComment
    }
}