import { Schema } from "mongoose";
import mongoose from "mongoose";
import { LikeRepository } from "../../domain/repositories/likeRepository";
import { LikeModel } from "../database/mongo/models/likeMode";
export class LikeRepositoryImpl implements LikeRepository{

    async likePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void> {
         try{
            const result = await LikeModel.updateOne(
                {userId},
                {$addToSet:{postIds:{$each:postIds}}},
                {upsert:true}
            )

         }catch(err){
            console.log('Error in like posting',err)
         }
      }


   async  unlikePosts(userId: Schema.Types.ObjectId, postIds: Schema.Types.ObjectId[]): Promise<void> {
         try {
            const userObjectId = typeof userId === 'string' ? new mongoose.Types.ObjectId(userId) : userId;
            const postObjectIds = postIds.map(id => 
              typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id
            );
      

         const result = await LikeModel.updateOne(
            {userId:userObjectId},
            {$pull:{postIds:{$in:postObjectIds}}},
         )
         
         } catch (err) {
           console.log('Error in unliking post', err);
         }
       }

}