import { Post } from "../../domain/entities/post";
import { LastSeenOnline, User } from "../../domain/entities/user";
import { ObjectId } from "mongoose";
export interface SignUpResponse{
    user:User,
    tokens:{
        accessToken:string,
        refreshToken:string
    }
}




export interface SignInResponse {
    user: {
        id: ObjectId;
        user_name: string;
        email: string;
    };
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
    user: {
        id: ObjectId;
        profileImage:string
        name:string
        user_name: string
        email: string;
        user_bio:string
        lastseen_online:LastSeenOnline
        is_suspended: boolean
    };
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
    name:string
}