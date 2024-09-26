import mongoose, { Schema } from "mongoose";
import { User } from "../entities/user";
import { Document } from "mongoose";
export interface AdminUserManagementRepository{
    getAllUsers():Promise<User[]>
    getUserById(user_id:Schema.Types.ObjectId):Promise<User | null>
    updateUser(user:User):Promise<void>
    suspendUser(user_id:mongoose.Types.ObjectId):Promise<void>
    unSuspendUser(user_id:mongoose.Types.ObjectId):Promise<void>
}