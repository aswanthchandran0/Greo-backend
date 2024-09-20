import { Schema } from "mongoose";
import {User, UserProfile } from "../entities/user";
export interface UserProfileRepository{
    save(userProfile:UserProfile):Promise<void>,
    findByUserId(user_id:Schema.Types.ObjectId):Promise<UserProfile|null>,
    profileUpdate(userId:Schema.Types.ObjectId,userData:Partial<User | UserProfile>):Promise<void>
}