import mongoose, { Document, Schema } from "mongoose";



interface ILike extends Document{
  postId:Schema.Types.ObjectId,
  postIds:string[],
  createdAt:Date
}


const likeSchema:Schema = new Schema({
  userId:{type:Schema.Types.ObjectId,required:true},
  postIds:{type:[Schema.Types.ObjectId],default:[]},
  createdAt:{type:Date,default: Date.now}
})

export const LikeModel = mongoose.model<ILike>('like',likeSchema)