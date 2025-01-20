import mongoose, { Document, Schema } from "mongoose";

interface ICommentContent {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt?: Date;
}

interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  comments: ICommentContent[];
  createdAt?: Date;
}

const commentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, required: true },
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date},
    },
  ],
});

export const CommentModel = mongoose.model<IComment>("comment", commentSchema);
