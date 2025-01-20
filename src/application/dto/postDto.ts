import mongoose from "mongoose";

export interface PostDto {
    id: string,
    userId:string,
    mediaUrls:string[],
    content: string,
    createdAt: Date,
    updatedAt: Date,
    type?:string,
    likeCount?:number,
    commentCount?:number,
    profileImage:string,
    user_name:string,
    name:string
    isBlocked?:boolean
}