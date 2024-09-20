import mongoose, { Schema } from "mongoose";
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { CommentModel } from "../database/mongo/models/commentModel";
import { Comment } from "../../domain/entities/comment";

export class commentRepositoryImpl implements CommentRepository{
   async findByPostId(postId: mongoose.Types.ObjectId): Promise<Comment[] | null> {
       const comments = await CommentModel.aggregate([
        {
            $match:{postId:postId}
        },
        {
            $lookup:{
               from:'users',
               localField:'userId',
               foreignField:'_id',
               as:'user'
            }

           },
           {
               $unwind:'$user'
           },
        {
              $project:{
                  _id:1,
                  content:1,
                  createdAt:1,
                  username:"$user.user_name",
                  userImage:"$user.user_image",

              }
        }
       ])
       console.log('comments',comments)
       return comments
   }


   
  async save(userId: mongoose.Types.ObjectId, postId: mongoose.Types.ObjectId, content:string): Promise<Comment> {
    const newComment = new CommentModel({
      userId,
      postId,
      content:content,
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
    await newComment.save()
    
    const aggregatedComment = await CommentModel.aggregate([
      {
        $match: { _id: newComment._id },
      },
      {
        $lookup:{
           from:'users',
           localField:'userId',
           foreignField:'_id',
           as:'user'
        }

       },
       {
           $unwind:'$user'
       },

    {
          $project:{
              _id:1,
              content:1,
              createdAt:1,
              username:"$user.user_name",
              userImage:"$user.user_image",

          }
        }

    ])
   console.log('new comment in comment repository impl',newComment)
   console.log('aggregated comment  in repository imple',aggregatedComment[0])
    return aggregatedComment[0]
  }

}