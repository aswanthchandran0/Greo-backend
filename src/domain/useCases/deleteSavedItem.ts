import mongoose from "mongoose";
import { UserSavingRepository } from "../repositories/userSavingRepository";

export class DeleteSavedItem {
    constructor(private userSavingRepository: UserSavingRepository) {}

    async execute(
        userId: mongoose.Types.ObjectId,
        itemId: string,
        type: "post" | "roll"
    ): Promise<boolean> {
        // Calling the repository method to delete the item
        return await this.userSavingRepository.delete(userId, itemId, type);
    }
}
