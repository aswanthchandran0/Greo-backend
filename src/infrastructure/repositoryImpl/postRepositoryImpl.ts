import { PostRepository } from "../../domain/repositories/postRepository";
import { IPost, PostModel } from "../database/mongo/models/postModel";
import { Post } from "../../domain/entities/post";
import { Iuser, UserModel } from "../database/mongo/models/userModel";
import Mongoose, { mongo } from "mongoose";
import mongoose, { Model, Types } from "mongoose";
import { SinglePost, userWithPosts } from "../../application/dto/userDto";
import { User } from "../../domain/entities/user";
import { CommentModel } from "../database/mongo/models/commentModel";
import { IUserPost } from "../../application/dto/userDto";
import { get } from "http";
import {
  postReportModel,
  ReasonType,
} from "../database/mongo/models/postReportModel";
import SavedItemModel from "../database/mongo/models/userSavedItems";

export class PostRepositoryImpl implements PostRepository {
  async savePostData(postData: Post): Promise<any> {
    const post = new PostModel(postData);
    return await post.save();
  }

 async getUserPosts(userId: Types.ObjectId): Promise<IUserPost[] | null> {
  

    const posts = await PostModel.aggregate([
      {
        $match: {
          userId: userId,
          isBlocked:{$ne:true}
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likeData",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comment",
        },
      },


      {
        $lookup: {
          from: "saveditems",  // Referencing the SavedItem collection
          let: { postId: "$_id" },  // Using the postId to match saved items
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", userId] },  // Match the userId
                    { $in: ["$$postId", "$items.itemId"] },  // Check if the postId is in the saved items list
                  ],
                },
              },
            },
            {
              $project: { _id: 1 },  // Only project the _id to check if the item is saved
            },
          ],
          as: "savedItemData",  // Store the result of the saved items lookup
        },
      },
      
      {
        $addFields: {
          likeCount: {
            $cond: {
              if: { $gt: [{ $size: "$likeData" }, 0] },
              then: { $size: { $first: "$likeData.users" } },
              else: 0,
            },
          },
          commentCount: {
            $cond: {
              if: { $gt: [{ $size: "$comment" }, 0] },
              then: { $size: { $first: "$comment.comments" } },
              else: 0,
            },
          },
          isSaved: {
            $cond: {
              if: { $gt: [{ $size: "$savedItemData" }, 0] },
              then: true,  // If savedItemData array has any items, the post is saved
              else: false,  // Otherwise, it's not saved
            },
          },
        },
      },

      {
        $sort:{
          createdAt:-1
        }
      },
      
      {
        $project: {
          _id: 1,
          mediaUrls: 1,
          content: 1,
          createdAt: 1,
          likeCount: 1,
          commentCount: 1,
          isSaved: 1,
        },
      },
    ]);
    return posts;
  }
  async getPostsByFollowing(
    userId: mongoose.Types.ObjectId,
    followedUserIds: Types.ObjectId[],
    skip: number,
    limit: number
  ): Promise<IUserPost[] | null> {
    const userIdObject = new mongoose.Types.ObjectId(userId);
     console.log('followedUserIds',followedUserIds)
    const savedItem = await SavedItemModel.findOne({userId:userId})
    // console.log('saved item single data',savedItem)
    const posts = await PostModel.aggregate([
      {
        $match: {
          userId: { $in: followedUserIds }, // Match posts created by followed users
          isBlocked:{$ne:true}
        },
      },
      {
        $skip: skip, // Skip specified number of documents
      },
      {
        $limit: limit, // Limit the number of documents
      },
      {
        $lookup: {
          from: "likes", // Lookup likes data
          localField: "_id",
          foreignField: "postId",
          as: "likeData",
        },
      },
      {
        $lookup: {
          from: "users", // Lookup user data for post owners
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $lookup: {
          from: "comments", // Lookup comments data
          localField: "_id",
          foreignField: "postId",
          as: "commentData",
        },
      },
      {
        $lookup: {
          from: "saveditems", // Lookup saved items to check if the post is saved
          let: { postId: "$_id" }, // Pass the current postId to the pipeline
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", userIdObject] }, // Match the userId
                    { $in: ["$$postId", "$items.itemId"] }, // Check if postId exists in items array
                  ],
                },
              },
            },
            {
              $project: { _id: 1 }, // Project only the _id field
            },
          ],
          as: "savedItemData", // Store the result of the saved items lookup
        },
      },
      {
        $addFields: {
          likeCount: {
            $cond: {
              if: { $isArray: "$likeData" },
              then: {
                $reduce: {
                  input: "$likeData",
                  initialValue: 0,
                  in: { $add: ["$$value", { $size: "$$this.users" }] }, // Sum the size of 'users' arrays
                },
              },
              else: 0,
            },
          },
          commentCount: {
            $reduce: {
              input: "$commentData",
              initialValue: 0,
              in: { $add: ["$$value", { $size: "$$this.comments" }] }, // Sum the size of 'comments' arrays
            },
          },
          isLiked: {
            $cond: {
              if: { $gt: [{ $size: "$likeData" }, 0] },
              then: {
                $reduce: {
                  input: "$likeData",
                  initialValue: false,
                  in: {
                    $or: ["$$value", { $in: [userIdObject, "$$this.users"] }],
                  }, // Check if the user's ID is in the 'users' array
                },
              },
              else: false,
            },
          },
          isSaved: {
            $cond: {
              if: { $gt: [{ $size: "$savedItemData" }, 0] },
              then: true, // If savedItemData has items, the post is saved
              else: false, // Otherwise, it's not saved
            },
          },
          userId: { $arrayElemAt: ["$user._id", 0] }, // Extract userId
          user_name: { $arrayElemAt: ["$user.user_name", 0] }, // Extract username
          name: { $arrayElemAt: ["$user.name", 0] }, // Extract name
          profileImage: { $arrayElemAt: ["$user.profileImage", 0] }, // Extract profile image
        },
      },
      {
        $project: {
          _id: 1,
          mediaUrls: 1,
          content: 1,
          createdAt: 1,
          likeCount: 1,
          commentCount: 1,
          isLiked: 1,
          isSaved: 1, // Include isSaved field
          userId: 1,
          user_name: 1,
          name: 1,
          profileImage: 1,
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort posts by creation date (newest first)
      },
    ]);
  
    return posts;
  }
  

  async deletePost(postId: Types.ObjectId): Promise<void> {
    try {
      console.log("request was reach in savcccccee here", postId);
      const result = await PostModel.deleteOne({ _id: postId });
      console.log("deleted post", result);
      await CommentModel.deleteMany({ postId: postId });
    } catch (err) {
      console.error("Error deleting post:", err);
      throw err;
    }
  }

  async updatePost(
    userId: Types.ObjectId,
    postId: Types.ObjectId,
    content: string
  ): Promise<void> {
    const post = await PostModel.findOne({ _id: postId });
    if (!post) throw new Error("post not found");
    if (post.userId.toString() !== userId.toString())
      throw new Error("you are not authorized to update this post");
    if (post) {
      post.content = content;
      await post.save();
    }
  }

  // report post
  async reportPost(
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId,
    reason: ReasonType
  ): Promise<void> {
    try {
      // Check if the user has already reported this post
      const existingReport = await postReportModel.findOne({
        postId,
        "users.id": userId,
      });

      if (existingReport) {
        // If the user has already reported, update the report by adding a new reason
        existingReport.users.push({ id: userId, reason });
        await existingReport.save();
        console.log("Updated report for user:", userId, "on post:", postId);
      } else {
        // If no report exists for this user, create a new report
        const newReport = new postReportModel({
          postId,
          users: [{ id: userId, reason }],
          createdAt: new Date(),
        });

        await newReport.save();
        console.log("Created new report for user:", userId, "on post:", postId);
      }
    } catch (error) {
      console.error("Error reporting post:", error);
      throw new Error("Failed to report post.");
    }
  }

  async getReportedPosts(): Promise<any> {
    try {
      const reportedPosts = await postReportModel.aggregate([
        {
          $lookup: {
            from: "posts",
            localField: "postId",
            foreignField: "_id",
            as: "postDetails",
          },
        },
        {
          $unwind: "$postDetails",
        },
        {
          $lookup: {
            from: "users",
            localField: "postDetails.userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails",
        },
        {
          $lookup: {
            from: "likes",
            localField: "postId",
            foreignField: "postId",
            as: "likeData",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "postId",
            foreignField: "postId",
            as: "commentData",
          },
        },
        {
          $addFields: {
            reportedCount: { $size: "$users" },
            likeCount: {
              $reduce: {
                input: "$likeData",
                initialValue: 0,
                in: { $add: ["$$value", { $size: "$$this.users" }] },
              },
            },
            commentCount: {
              $reduce: {
                input: "$commentData",
                initialValue: 0,
                in: { $add: ["$$value", { $size: "$$this.comments" }] },
              },
            },
          },
        },
        {
          $project: {
            _id: 1, // Report ID
            postId: 1,
            "postDetails.mediaUrls": 1,
            "postDetails.mediaType": 1,
            "postDetails.content": 1,
            "postDetails.createdAt": 1,
            "postDetails.isBlocked":1,
            "userDetails.name": 1,
            "userDetails.user_name": 1,
            "userDetails.email": 1,
            "userDetails.profileImage": 1,
            users: 1, // Reported users and reasons
            createdAt: 1, // Report creation timestamp
            reportedCount: 1,
            likeCount: 1,
            commentCount: 1,
            userId:"$userDetails._id",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);
      return reportedPosts;
    } catch (error) {
      console.error("Error fetching reported posts:", error);
      throw error;
    }
  }
  
  async getPost(
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
  ): Promise<IPost | null> {
    try {
      const post = await PostModel.aggregate([
        {
          $match: { _id: postId }, // Match the specific post by its ID
          
        },
        {
          $lookup: {
            from: "users", // Reference the users collection
            localField: "userId", // Field in the posts collection
            foreignField: "_id", // Field in the users collection
            as: "userDetails", // Output field name
          },
        },
        {
          $unwind: "$userDetails", // Unwind the userDetails array to get an object
        },
        {
          $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "postId",
            as: "likeData",
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "postId",
            as: "commentData",
          },
        },
        {
          $addFields: {
            likeCount: {
              $reduce: {
                input: "$likeData",
                initialValue: 0,
                in: { $add: ["$$value", { $size: "$$this.users" }] },
              },
            },
            commentCount: {
              $reduce: {
                input: "$commentData",
                initialValue: 0,
                in: { $add: ["$$value", { $size: "$$this.comments" }] },
              },
            },
            isLiked: {
              $reduce: {
                input: "$likeData",
                initialValue: false,
                in: {
                  $or: ["$$value", { $in: [userId, "$$this.users"] }],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            mediaUrls: 1,
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            likeCount: 1,
            commentCount: 1,
            isLiked: 1,
            userId: "$userDetails._id",   
            name: "$userDetails.name",     
            user_name: "$userDetails.user_name", 
            profileImage: "$userDetails.profileImage", 
          },
        },
      ]);
  
      return post.length > 0 ? post[0] : null; // Return the post or null if not found
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  
  }
  
  async  getAllPosts():Promise<IPost[] | null>{
  return await PostModel.find({isBlocked:{$ne:true}}) 
  }
  
  async blockAndUnblockPost(postId: mongoose.Types.ObjectId,action:boolean): Promise<boolean> {

    // Perform the update
    const post = await PostModel.findOne({ _id: postId });
console.log('finded post in the block area',post);


    const updatedPost = await PostModel.updateOne(
      { _id: postId },
      { $set: { isBlocked: action } }
    );
    console.log('updatedPost ',updatedPost)
    return updatedPost.modifiedCount > 0; 
  }


 
  async getUserPostByPostId(postId: mongoose.Types.ObjectId): Promise<SinglePost | null> {
    try {
      const result = await PostModel.aggregate([
        {
          $match: { _id: postId }, // Match the post by its ID
        },
        {
          $lookup: {
            from: "users", 
            localField: "userId", 
            foreignField: "_id", 
            as: "userDetails",
          },
        },
        {
          $unwind: "$userDetails", // Unwind the array to get a single user document
        },
        {
          $project:{
            _id: 1,
          "userDetails.name": 1,
          "userDetails.user_name": 1,
          "userDetails.profileImage": 1,
          "userDetails.email": 1,
          mediaUrls: 1,
          content: 1,
          createdAt: 1,

          }
        }
      ]);
      if (result.length === 0) {
        return null; // Return null if no result found
      }
      const post = result[0];

      return {
        _id: post._id.toString(),
        name: post.userDetails.name,
        username: post.userDetails.user_name,
        profileImage: post.userDetails.profileImage,
        email:post.userDetails.email,
        mediaUrls: post.mediaUrls,
        content: post.content,
        createdAt: post.createdAt,
      };

    } catch (error) {
      console.error("Error fetching user by postId:", error);
      throw error;
    }
  }
  
  // async getPostsWithDetails(ObjectUserId:Mongoose.Types.ObjectId): Promise<Post[] | null> {
  //     try{
  //     const posts  = await PostModel.aggregate([
  //         {
  //          $lookup:{
  //             from:'users',
  //             localField:'userId',
  //             foreignField:'_id',
  //             as:'user'
  //          }

  //         },
  //         {
  //             $unwind:'$user'
  //         },
  //         {
  //             $lookup:{
  //                 from:'likes',
  //                 localField:'_id',
  //                 foreignField:'postIds',
  //                 as:'likes'
  //             }
  //         },
  //         {
  //         $addFields:{
  //             totalLikes:{$size:'$likes'},
  //             isLiked:{$in:[ObjectUserId,'$likes.userId']}
  //         }
  //         },
  //        {
  //         $lookup:{
  //             from:"comments",
  //             localField:'_id',
  //             foreignField:"postId",
  //             as:'comments'
  //         }
  //        },
  //        {
  //         $addFields:{
  //             totalComments:{$size:'$comments'}
  //         }
  //        },
  //        {
  //         $project:{
  //             _id:1,
  //             userId:1,
  //             username:"$user.user_name",
  //             userImage:"$user.profileImage",
  //             userBio:"$user.user_bio",
  //             mediaUrls:1,
  //             mediaType:1,
  //             content:1,
  //             createdAt:1,
  //             updatedAt:1,
  //             totalLikes:1,
  //             totalComments:1,
  //             isLiked:1
  //         }
  //        }
  //     ])
  //     console.log('posts details',posts)
  //     return posts
  //     }catch(err){
  //         console.log(err)
  //     return null
  //     }

  // }

  //   async  getPostsByUserName(username: string): Promise<Post[] | null> {
  //     try{
  //         const user = await UserModel.findOne({user_name:username})
  //         if(user){

  //     const posts = await PostModel.aggregate([
  //         {
  //             $match:{
  //                userId:user._id
  //             }
  //         },
  //          {
  //             $lookup:{
  //                 from:'likes',
  //                 localField:'_id',
  //                 foreignField:'postIds',
  //                 as:'likes'
  //             }
  //          },
  //          {
  //            $addFields:{
  //                totalLikes:{$size:'$likes'},
  //                isLiked:{$in:[user._id,'$likes.userId']}
  //            }
  //          }
  //        ,
  //        {
  //         $lookup:{
  //             from:"comments",
  //             localField:'_id',
  //             foreignField:"postId",
  //             as:'comments'
  //         }
  //        },
  //        {
  //         $addFields:{
  //             totalComments:{$size:'$comments'}
  //         }
  //        },

  //        {
  //         $project:{
  //             _id:1,
  //             userId:1,
  //             username:"$user.user_name",
  //             userImage:"$user.profileImage",
  //             userBio:"$user.user_bio",
  //             mediaUrls:1,
  //             mediaType:1,
  //             content:1,
  //             createdAt:1,
  //             updatedAt:1,
  //             totalLikes:1,
  //             totalComments:1,
  //             isLiked:1
  //         }
  //        }
  //      ])

  //     return posts
  //       }
  //       return null
  //     }catch(err){
  //         console.log('error:',err)
  //         throw new Error('something went wrong')
  //     }

  //     }
}
