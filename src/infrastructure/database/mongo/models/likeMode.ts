import mongoose, { Document, Schema } from "mongoose";

interface ILike extends Document {
  postId: Schema.Types.ObjectId;
  userIds: string[];
  createdAt: Date;
}

const likeSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, required: true },
  users:[{ type: Schema.Types.ObjectId, required: true }],
});

export const LikeModel = mongoose.model<ILike>("like", likeSchema);
