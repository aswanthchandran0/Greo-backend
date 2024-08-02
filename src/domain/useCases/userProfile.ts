import { UserProfile } from "../entities/user";
import { UserProfileRepository } from "../repositories/userProfileRepository";


export class UpdateUserProfile{
    constructor(private userProfileRepository:UserProfileRepository) {}
    async execute(UserProfile:UserProfile):Promise<void>{
        await this.userProfileRepository.update(UserProfile)
    }
}