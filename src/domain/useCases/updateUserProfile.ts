import { UserProfileRepository } from "../repositories/userProfileRepository";
import { User } from "../entities/user";
import { Schema } from "mongoose";

export class UpdateUserProfile{
    constructor(private userProfileRepository:UserProfileRepository) {}

    async execute(userId: Schema.Types.ObjectId, userData: Partial<User>): Promise<void> {
        await this.userProfileRepository.profileUpdate(userId, userData);
    }
}