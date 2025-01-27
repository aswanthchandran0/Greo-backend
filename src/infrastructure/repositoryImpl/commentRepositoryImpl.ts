import mongoose, { mongo, Schema } from "mongoose";
import { CommentRepository } from "../../domain/repositories/commentRepository";
import { CommentModel } from "../database/mongo/models/commentModel";
import { Comment } from "../../domain/entities/comment";
import { UserModel } from "../database/mongo/models/userModel";
import { CommentDto, CommentsDto } from "../../application/dto/commentDto";
import { PostModel } from "../database/mongo/models/postModel";

export class commentRepositoryImpl implements CommentRepository{
 
  async save(comment: Comment): Promise<CommentDto | null> {
    console.log('comment in saved repo',comment)
    try {
      const existingComments   = await CommentModel.findOne({ postId: comment.postId }).exec();
      const user = await UserModel.findById(comment.comments[0].userId).exec();
      console.log('comment',comment)
      console.log('user ',user)
      if (existingComments  && user) {
        existingComments .comments.push(...comment.comments);
 
        const savedPost = await existingComments.save();
        const savedComment = comment.comments[0];
  
        const commentDto: CommentDto = {
          postId: savedPost.postId,
          userId: savedComment.userId,
          content: savedComment.content,
          createdAt: savedComment.createdAt,
          userDetails: {
            _id:user._id,
              user_name:user.user_name,
              profileImage:user.profileImage
          },
        };
  
        return commentDto; 
  
      } else if (!existingComments) {
        if (user) {
          const newCommentModel = new CommentModel({
            postId: comment.postId,
            comments: comment.comments,
            createdAt: new Date(),
          });
  
          const savedNewComment = await newCommentModel.save();
          const savedComment = savedNewComment.comments[0];
  
          const commentDto: CommentDto = {
            postId: savedNewComment.postId,
            userId: savedComment.userId,
            content: savedComment.content,
            createdAt: savedComment.createdAt || new Date(),
            userDetails: {
              _id:user._id,
              user_name:user.user_name,
              profileImage:user.profileImage
            },
          };
  
          return commentDto; 
  
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
  
 async findByPostId(postId: mongoose.Types.ObjectId): Promise<CommentsDto[] | null> {
    
     const comments = await CommentModel.aggregate([
       {
        $match:{
            postId:postId
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
              postId: { $first: "$postId" },
              comments: { $push: "$comments" },
              createdAt: { $first: "$createdAt" },
              updatedAt: { $first: "$updatedAt" },
            },
          },

     ])

     console.log('comment in model',...comments)
     return comments
 }





//    async findByPostId(postId: mongoose.Types.ObjectId): Promise<Comment[] | null> {
//        const comments = await CommentModel.aggregate([
//         {
//             $match:{postId:postId}
//         },
//         {
//             $lookup:{
//                from:'users',
//                localField:'userId',
//                foreignField:'_id',
//                as:'user'
//             }

//            },
//            {
//                $unwind:'$user'
//            },
//         {
//               $project:{
//                   _id:1,
//                   content:1,
//                   createdAt:1,
//                   username:"$user.user_name",
//                   profileImage:"$user.profileImage",
                  
//               }
//         }
//        ])
//        console.log('comments',comments)
//        return comments
//    }


   
//   async save(userId: mongoose.Types.ObjectId, postId: mongoose.Types.ObjectId, content:string): Promise<Comment> {
//     const newComment = new CommentModel({
//       userId,
//       postId,
//       content:content,
//       createdAt: Date.now(),
//       updatedAt: Date.now()
//     })
//     await newComment.save()
    
//     const aggregatedComment = await CommentModel.aggregate([
//       {
//         $match: { _id: newComment._id },
//       },
//       {
//         $lookup:{
//            from:'users',
//            localField:'userId',
//            foreignField:'_id',
//            as:'user'
//         }

//        },
//        {
//            $unwind:'$user'
//        },

//     {
//           $project:{
//               _id:1,
//               content:1,
//               createdAt:1,
//               username:"$user.user_name",
//               profileImage:"$user.profileImage",

//           }
//         }

//     ])
//    console.log('new comment in comment repository impl',newComment)
//    console.log('aggregated comment  in repository imple',aggregatedComment[0])
//     return aggregatedComment[0]
//   }

}