import mongoose, { Document, Schema } from "mongoose";

interface ICommentContent {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}

interface IRollComment extends Document {
  rollId: mongoose.Types.ObjectId;
  comments: ICommentContent[];
  createdAt?: Date;
}

const rollCommentSchema: Schema = new Schema({
  rollId: { type: Schema.Types.ObjectId, required: true },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date},
    },
  ],
});

export const RollCommentModel = mongoose.model<IRollComment>("rollComment", rollCommentSchema);
