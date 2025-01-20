import mongoose, { mongo, Schema } from "mongoose";

export type UserGender = "prefer not to say" | "male" | "female" | "other";
export type LastSeenOnline = "Everyone" | "private" | "hide";

export class User {
  constructor(
    public id: mongoose.Types.ObjectId,
    public name: string,
    public profileImage: string,
    public user_name: string,
    public email: string,
    public user_bio: string,
    public lastseen_online: LastSeenOnline,
    public password: string,
    public user_gender: UserGender,
    public private_account: boolean,
    public is_suspended:boolean,
    public is_verified: boolean, 
    public createdAt?:Date
  ) {}
}
