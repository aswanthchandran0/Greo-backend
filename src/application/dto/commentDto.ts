import mongoose from "mongoose";

// commentDto.ts
export interface CommentDto {
  postId: mongoose.Types.ObjectId;
   userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  userDetails: { 
    _id:mongoose.Types.ObjectId
    user_name:string
    profileImage:string

  };
}

export interface CommentsDto {
  postId: mongoose.Types.ObjectId;
  comments: CommentDto[];
}


export interface RollCommentDto {
  rollId: mongoose.Types.ObjectId;
   userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  userDetails: { 
    _id:mongoose.Types.ObjectId
    user_name:string
    profileImage:string

  };
}

export interface RollCommentsDto {
  rollId: mongoose.Types.ObjectId;
  comments: RollCommentDto[];
}


