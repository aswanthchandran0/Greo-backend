import { Mongoose, Schema } from "mongoose";
import mongoose from "mongoose";
import { LikeRepository } from "../../domain/repositories/likeRepository";
import { LikeModel } from "../database/mongo/models/likeMode";
import { User } from "../../domain/entities/user";
import { Iuser } from "../database/mongo/models/userModel";
export class LikeRepositoryImpl implements LikeRepository{

    async likePosts(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
         try{
            await Promise.all(
                postIds.map(async (postId) => {
                    await LikeModel.updateOne(
                        {postId:postId},
                            { $addToSet: { users: userId  } }, 
                            { upsert: true }
                        ,
                    )
                })
            )
         }catch(err){
            console.log('Error in like posting',err)
         }
      }


   async  unlikePosts(userId: mongoose.Types.ObjectId, postIds: mongoose.Types.ObjectId[]): Promise<void> {
         try {
         await Promise.all(
            postIds.map(async (postId) => {
                await LikeModel.updateOne(
                    { postId },
                    { $pull: { users:userId  } } 
                  )
            })
         )
       }catch (err) {
        console.log("Error in unliking posts", err);
      }

}

 async getLikedUsers(postId: mongoose.Types.ObjectId): Promise<Iuser[] | null> {
    const result = await LikeModel.aggregate([
        { $match: { postId } }, 
        {
          $lookup: {
            from: "users",
            localField: "users",
            foreignField: "_id", 
            as: "userDetails", 
          },
        },
        { $unwind: "$userDetails" }, 
        {
          $project: {
            "userDetails.password": 0,
          },
        },
      ]);
    
      return result.map((item) => item.userDetails) || null;
}   
}