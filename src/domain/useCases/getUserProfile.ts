import { UserProfileRepository } from '../repositories/userProfileRepository';
import { UserProfile } from '../entities/user';
import { Schema } from 'mongoose';

export class GetUserProfile {
    constructor(private userProfileRepository: UserProfileRepository) {}

    async execute(user_id: Schema.Types.ObjectId): Promise<UserProfile | null> {
        return this.userProfileRepository.findByUserId(user_id);
    }
}