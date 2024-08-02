import { UserProfileRepository } from "../../domain/repositories/userRepository";
import { User, UserProfile } from "../../domain/entities/user";
import { UserProfileModel } from "../database/mongo/userProfileModel";

export class  userProfileRepositoryImpl implements UserProfileRepository{
    async save(userProfile:UserProfile):Promise<void>{
        const userProfileModel = new UserProfileModel(userProfile)
        await userProfileModel.save()
    }
    async findByUserId(user_id: string): Promise<UserProfile | null> {
        const userProfileModel =await UserProfileModel.findOne({user_id}).exec()
        return userProfileModel?
        new UserProfile(
       userProfileModel.user_id,
       userProfileModel.user_image,
       userProfileModel.user_bio,
       userProfileModel.user_gender,
       userProfileModel.private_account,
       userProfileModel.lastseen_online,
       userProfileModel.post,
       userProfileModel.roll,
       userProfileModel.followers,
       userProfileModel.following,
       userProfileModel.community,
       userProfileModel.stories
        ):null
    }
    async update(userProfile:UserProfile):Promise<void>{
        await UserProfileModel.updateOne({user_id:userProfile.user_id},userProfile,{upsert:true})
    }
}
