import { UserProfileRepository } from "../../domain/repositories/userProfileRepository";
import { User, UserProfile } from "../../domain/entities/user";
import { UserProfileModel } from "../database/mongo/userProfileModel";
import { Schema } from "mongoose";
import { UserModel } from "../database/mongo/models/userModel";
export class  userProfileRepositoryImpl implements UserProfileRepository{
    async save(userProfile:UserProfile):Promise<void>{
        const userProfileModel = new UserProfileModel(userProfile)
        await userProfileModel.save()
    }
    async findByUserId(user_id: Schema.Types.ObjectId): Promise<UserProfile | null> {
        const userProfileModel =await UserProfileModel.findOne({user_id}).exec()
        return userProfileModel?
        new UserProfile(
       userProfileModel.user_id,
       userProfileModel.user_gender,
       userProfileModel.private_account,
       userProfileModel.post,
       userProfileModel.roll,
       userProfileModel.community,
       userProfileModel.stories
        ):null
    }
  
    async profileUpdate(userId: Schema.Types.ObjectId, userData:any): Promise<void> {
         const {profileImage,name,userName,bio,gender} = userData
      
     
        const userUpdateData: Partial<User> = {};

        if (profileImage) userUpdateData.profileImage = profileImage;
        if (name) userUpdateData.name = name;
        if (userName) {
            const existedUserName = await UserModel.findOne({userName });
            if (existedUserName) {
                throw new Error('Username already exists');
            }
            userUpdateData.user_name = userName;
        }
        if (bio) userUpdateData.user_bio = bio;

        const userProfileUpdateData: Partial<UserProfile> = {};
        if (gender) userProfileUpdateData.user_gender = gender;

        if (Object.keys(userUpdateData).length > 0) {
            await UserModel.updateOne({ _id: userId }, { $set: userUpdateData });
        }


        if (Object.keys(userProfileUpdateData).length > 0) {
            await UserProfileModel.updateOne({ user_id: userId }, { $set: userProfileUpdateData });
        }

        }


}
