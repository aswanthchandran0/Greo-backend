import { CommentDto, CommentsDto } from "../../application/dto/commentDto"
import { Comment } from "../entities/comment"
import mongoose, { Schema } from "mongoose"
export interface CommentRepository{
    save(comment:Comment):Promise<CommentDto |null>
    findByPostId(postId:mongoose.Types.ObjectId):Promise<CommentsDto[] | null>
}