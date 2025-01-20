import { CommentDto } from "../../application/dto/commentDto"
import { Comment, CommentContent } from "../entities/comment"
import { CommentRepository } from "../repositories/commentRepository"
import mongoose from "mongoose"
export class PostComment{

    constructor(private commentRepository: CommentRepository){}
    async execute(userId: mongoose.Types.ObjectId, postId: mongoose.Types.ObjectId, content: string): Promise<CommentDto | null> {

      const commentContent = new CommentContent(
        userId,
        content,
        new Date()
      )
      const comment = new Comment(postId,[commentContent],new Date())
      const savedComment =  await this.commentRepository.save(comment)
     return savedComment
    }
}