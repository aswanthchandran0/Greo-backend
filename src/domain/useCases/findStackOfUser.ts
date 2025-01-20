import mongoose from "mongoose";
import { userRepository } from "../repositories/userRepository";
import { Iuser } from "../../infrastructure/database/mongo/models/userModel";


export class FindStackOfUser{
    constructor (private userRepository:userRepository){}

    async execute(userIds:mongoose.Types.ObjectId[]):Promise<Iuser[] | null>{
        return await this.userRepository.findStackOfUser(userIds)
    }
}