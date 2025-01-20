import mongoose, { mongo, Schema } from "mongoose";
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { CommentModel } from "../database/mongo/models/commentModel";
import { Comment, RollComment } from "../../domain/entities/comment";
import { UserModel } from "../database/mongo/models/userModel";
import { CommentDto, CommentsDto, RollCommentDto } from "../../application/dto/commentDto";
import { PostModel } from "../database/mongo/models/postModel";
import { RollCommentRepository } from "../../domain/repositories/rollCommentRepository";
import { RollCommentModel } from "../database/mongo/models/rollCommentModel";

export class RollCommentRepositoryImpl implements RollCommentRepository{
 
  async save(comment: RollComment): Promise<RollCommentDto | null> {
    try {
      const existingComments   = await RollCommentModel.findOne({ rollId: comment.rollId }).exec();
      const user = await UserModel.findById(comment.comments[0].userId).exec();

      if (existingComments  && user) {
        existingComments .comments.push(...comment.comments);
 
        const savedPost = await existingComments.save();
        const savedComment = comment.comments[0];
  
        const RollCommentDto: RollCommentDto = {
          rollId: savedPost.rollId,
          userId: savedComment.userId,
          content: savedComment.content,
          createdAt: savedComment.createdAt,
          userDetails: {
            _id:user._id,
              user_name:user.user_name,
              profileImage:user.profileImage
          },
        };
  
        return RollCommentDto; 
  
      } else if (!existingComments) {
        if (user) {
          const newCommentModel = new RollCommentModel({
            rollId: comment.rollId,
            comments: comment.comments,
            createdAt: new Date(),
          });
  
          const savedNewComment = await newCommentModel.save();
          const savedComment = savedNewComment.comments[0];
  
          const RollCommentDto: RollCommentDto = {
            rollId: savedNewComment.rollId,
            userId: savedComment.userId,
            content: savedComment.content,
            createdAt: savedComment.createdAt || new Date(),
            userDetails: {
              _id:user._id,
              user_name:user.user_name,
              profileImage:user.profileImage
            },
          };
  
          return RollCommentDto; 
  
        } else {
          console.log("User not found");
          return null;
        }
         }   else {

        console.log("Post or User not found");
        return null;
      }
  
    } catch (err) {
      console.log('Error:', err);
      return null;
    }
  }
  
 async findByRollId(rollId: mongoose.Types.ObjectId): Promise<RollCommentDto[] | null> {
    
  console.log('rollid in roll finding',rollId)
     const rollComments = await RollCommentModel.aggregate([
       {
        $match:{
            rollId:rollId
        }
       },
       { $unwind: "$comments" },
       {
        $lookup: {
          from: "users", // Collection name for UserModel
          localField: "comments.userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      {
        $addFields: {
          "comments.userDetails": { $arrayElemAt: ["$userDetails", 0] },
        },
      },

       {
        $sort:{"comments.createdAt":-1}
       },
        // Re-group the comments back into an array
        {
            $group: {
              _id: "$_id",
              rollId: { $first: "$rollId" },
              comments: { $push: "$comments" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
            },
          },

     ])

     return rollComments
 }


}