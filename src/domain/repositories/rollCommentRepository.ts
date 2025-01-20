import { CommentDto, CommentsDto, RollCommentDto } from "../../application/dto/commentDto"
import { Comment, RollComment } from "../entities/comment"
import mongoose, { Schema } from "mongoose"
export interface RollCommentRepository{
    save(comment:RollComment):Promise<RollCommentDto |null>
    findByRollId(rollId:mongoose.Types.ObjectId):Promise<RollCommentDto[] | null>
}