import mongoose from "mongoose";

// Class to represent individual comment content
export class CommentContent {
  constructor(
    public userId: mongoose.Types.ObjectId,
    public content: string,
    public createdAt: Date,
  ) {}
  
  
}

// Class to represent the main comment document
export class Comment {
  constructor(
    public postId: mongoose.Types.ObjectId,
    public comments: CommentContent[], // Array of CommentContent
    public createdAt: Date
  ) {}

  
}


export class RollComment {
  constructor(
    public rollId: mongoose.Types.ObjectId,
    public comments: CommentContent[], // Array of CommentContent
    public createdAt: Date
  ) {}

  
}