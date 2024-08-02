import { UserProfileRepository } from '../repositories/userProfileRepository';
import { UserProfile } from '../entities/user';

export class GetUserProfile {
    constructor(private userProfileRepository: UserProfileRepository) {}

    async execute(user_id: string): Promise<UserProfile | null> {
        return this.userProfileRepository.findByUserId(user_id);
    }
}