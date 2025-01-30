import mongoose, { ClientSession } from "mongoose";
import { User } from "../entities/user";
import { PreProcessedFileInfo } from "typescript";
import { IFollowers, TopFollowerUserDto } from "../../application/dto/userDto";
import { Iuser } from "../../infrastructure/database/mongo/models/userModel";

export interface userRepository{
    save(user:User,session?: ClientSession): Promise<User>;
    findByEmail(email:string,session?: ClientSession): Promise<User|null>
    findByUserName(userName:string,session?: ClientSession):Promise<User|null>
    findByUserId(userId:mongoose.Types.ObjectId):Promise<User|null>
    updatePassword(userId:string,password:string):Promise<void>
    deleteUser(userId:mongoose.Types.ObjectId):Promise<void>
    updateUser(userId:mongoose.Types.ObjectId,updateField:Partial<User>):Promise<User | null>
    getArrayOfUsers(userIds:IFollowers[]):Promise<User[] | null>
    searchUsers(query: string): Promise<Iuser[]>;
    findStackOfUser(userIds:mongoose.Types.ObjectId[]):Promise<Iuser[] | null>
     getUsersWithPagination(userId:mongoose.Types.ObjectId,page: number, limit: number): Promise<{ users: TopFollowerUserDto[], totalUsers: number }>;
}             