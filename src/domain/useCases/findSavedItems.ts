import mongoose from "mongoose";
import { UserSavingRepository } from "../repositories/userSavingRepository";
import { SavedItemDto } from "../../application/dto/savedItemDto";


export class FindSavedItems{
    constructor(private userSavingRepository:UserSavingRepository){}

    async execute(userId:mongoose.Types.ObjectId):Promise<SavedItemDto[] | null>{
        return await this.userSavingRepository.findAllSavedItems(userId)
    }
}