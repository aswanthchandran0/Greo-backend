import mongoose, { Document, Schema } from "mongoose";

interface IRollLike extends Document {
  rollId: mongoose.Types.ObjectId;
  userIds: string[];
  createdAt: Date;
}

const rollLikeSchema: Schema = new Schema({
  rollId: { type: Schema.Types.ObjectId, required: true },
  users:[{ type: Schema.Types.ObjectId, required: true }],
});

export const RollLikeModel = mongoose.model<IRollLike>("rollLike", rollLikeSchema);
