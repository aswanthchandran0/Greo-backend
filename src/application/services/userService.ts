import { SignupUser } from "../../domain/useCases/signupUser";
import { User, UserProfile } from "../../domain/entities/user";
import { SigninUser } from "../../domain/useCases/signinUser";
import { UpdateUserProfile } from "../../domain/useCases/userProfile";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";

export class UserService{
    constructor(
        private signupUser:SignupUser,
        private signinUser:SigninUser,
        private updateUserProfile:UpdateUserProfile,
        private getUserProfile:GetUserProfile
    ){}

    async signup(userData:{user_name:string;full_name:string;email:string;phone_number:Number;password:string}):Promise<User>{
         return   this.signupUser.execute(userData)
    }
    
   async signin(email:string,password:string):Promise<User>{
        return this.signinUser.execute(email,password)
   }
   async updateProfile(userProfile:UserProfile):Promise<void>{
     await this.updateUserProfile.execute(userProfile)
   }
   async getProfile(user_id:string):Promise<UserProfile |null>{
       return this.getUserProfile.execute(user_id)
   }
}
