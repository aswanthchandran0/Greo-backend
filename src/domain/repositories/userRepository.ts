import mongoose, { ClientSession } from "mongoose";
import { User } from "../entities/user";
import { PreProcessedFileInfo } from "typescript";

export interface userRepository{
    save(user:User,session?: ClientSession): Promise<User>;
    findByEmail(email:string,session?: ClientSession): Promise<User|null>
    findByUserName(userName:string,session?: ClientSession):Promise<User|null>
    findByUserId(userId:mongoose.Types.ObjectId):Promise<User|null>
}             