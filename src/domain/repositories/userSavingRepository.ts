import mongoose, { mongo } from "mongoose";
import { SavedItemArrayElement } from "../entities/saveItems";
import { SavedItemDto } from "../../application/dto/savedItemDto";


export interface UserSavingRepository {
    save(userId:mongoose.Types.ObjectId,item:SavedItemArrayElement): Promise<SavedItemDto | null>
    delete(userId: mongoose.Types.ObjectId, itemId: string, type: "post" | "roll"): Promise<boolean>;
    findAllSavedItems(userId:mongoose.Types.ObjectId):Promise<SavedItemDto[] | null>
}