import { CommentDto, RollCommentDto } from "../../application/dto/commentDto"
import { Comment, CommentContent, RollComment } from "../entities/comment"
import { CommentRepository } from "../repositories/commentRepository"
import mongoose from "mongoose"
import { RollCommentRepository } from "../repositories/rollCommentRepository"
export class RollPostComment{

    constructor(private rollCommentRepository: RollCommentRepository){}
    async execute(userId: mongoose.Types.ObjectId, rollId: mongoose.Types.ObjectId, content: string): Promise<RollCommentDto | null> {

      const commentContent = new CommentContent(
        userId,
        content,
        new Date()
      )
      const comment = new RollComment(rollId,[commentContent],new Date())
      const savedComment =  await this.rollCommentRepository.save(comment)
     return savedComment
    }
}