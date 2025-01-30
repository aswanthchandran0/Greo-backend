import { Post } from "../../domain/entities/post";
import {  User, UserGender } from "../../domain/entities/user";
import mongoose, { ObjectId } from "mongoose";



export interface SignUpResponse{
    user:User,
   otpSent:boolean
}




export interface SignInResponse {
    user:User,
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}


export interface GoogleSignUpResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface GoogleSignInResponse {
    user: User;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}


export interface userWithPosts{
    user:User,
    posts:Post[],
}

export interface graphUser{
    id:string,
}



 export interface Result<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface IUserPost{
 _id:mongoose.Types.ObjectId,
 mediaUrls: string[]; // Media URLs associated with the post
 content: string; // Content of the post
 createdAt: Date; // Creation date
 likeCount: number; // Number of users who liked the post
 commentCount: number; // Number of comments on the post
}


// in admin pannel for getting user



export interface UserDetails{
  user:User
  posts:IUserPost[] |null
  followersCount:number
  followingCount:number 
}



// graph Followers interface

export interface IFollowers{
    id:string
}



export interface SinglePost{
    _id:string,
    name:string
    email?:string
    username:string,
    profileImage:string,
    mediaUrls: string[]; // Media URLs associated with the post
    content: string; // Content of the post
    createdAt: Date; // Creation date
    likeCount?: number; // Number of users who liked the post
    commentCount?: number; // Number of comments on the post
  }


  export interface TopFollowerUser {
    id: string;
    name: string;
    followersCount: number; // The count of followers
  }
  
  export interface TopFollowerUserDto{
    _id: mongoose.Types.ObjectId;
      name: string;
      profileImage: string;
      user_name: string;
      email: string;
      user_bio: string;
      lastseen_online: string;
      user_gender: UserGender;
      private_account: boolean;
      is_suspended: boolean;
      is_verified: boolean;
      publicKey?: string;
      createdAt?:Date
      followersCount: number;
  }
