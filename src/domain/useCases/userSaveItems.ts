import mongoose from "mongoose";
import { UserSavingRepository } from "../repositories/userSavingRepository";
import { SavedItemArrayElement } from "../entities/saveItems";
import { SavedItemDto } from "../../application/dto/savedItemDto";


export class UserSaveItem{
    constructor (private userSavingRepository:UserSavingRepository){}

    async execute(userId:mongoose.Types.ObjectId,item:SavedItemArrayElement): Promise<SavedItemDto | null>{
  return await this.userSavingRepository.save(userId,item)
    }
}