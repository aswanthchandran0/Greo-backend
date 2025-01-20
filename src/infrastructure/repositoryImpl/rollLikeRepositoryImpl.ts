import mongoose from "mongoose";
import { LikeModel } from "../database/mongo/models/likeMode";
import { RollLikeRepository } from "../../domain/repositories/rollLikeRepository";
import { RollLikeModel } from "../database/mongo/models/rollLikeModel";
export class RollLikeRepositoryImpl implements RollLikeRepository{

    async likePosts(userId: mongoose.Types.ObjectId, rollIds: mongoose.Types.ObjectId[]): Promise<void> {
         try{
            await Promise.all(
                rollIds.map(async (rollId) => {
                    await RollLikeModel.updateOne(
                        {rollId:rollId},
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


   async  unlikePosts(userId: mongoose.Types.ObjectId, rollIds: mongoose.Types.ObjectId[]): Promise<void> {
         try {
         await Promise.all(
            rollIds.map(async (rollId) => {
                await RollLikeModel.updateOne(
                    { rollId },
                    { $pull: { users:userId  } } 
                  )
            })
         )
       }catch (err) {
        console.log("Error in unliking posts", err);
      }

}
}