import mongoose from "mongoose";
import { userRepository } from "../repositories/userRepository";


export class GetUserProfiles {
    constructor(private userRepository:userRepository){}

    async execute (userId:mongoose.Types.ObjectId,page: number, limit: number = 8){
        return await this.userRepository.getUsersWithPagination(userId,page,limit)
    }
}