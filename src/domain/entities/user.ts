import { Schema } from "mongoose"
export class User{
    constructor(
        public id:Schema.Types.ObjectId,
        public profileImage:string,
        public name:string,
        public user_name:string,
        public email:string,
        public user_bio:string,
        public lastseen_online:LastSeenOnline,
        public password:string,
        public is_suspended: boolean ,
        public publicKey?:string,
        public followersCount?: number, 
        public followingCount?: number,
        public isFollowing?: boolean ,
        // public is_verified:boolean
    ){}
}

export type UserGender = 'prefer not to say'|'male'|'female'|'other'
export type LastSeenOnline = 'Everyone'|'private'|'hide'

export class UserProfile{
    constructor(
    public user_id:Schema.Types.ObjectId,
    public user_gender:UserGender, 
    public private_account:boolean,
    public post:string[],
    public roll:string[],
    public community:string[],
    public stories:string[]

    ){}
}
