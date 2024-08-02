import bcrypt from 'bcrypt'
import { User, UserProfile } from '../entities/user'
import { userRepository} from '../repositories/userRepository'
import { UserProfileRepository } from '../repositories/userProfileRepository'
import { PasswordValidation } from '../validations/passwordValidation'
export class  SignupUser {
    private saltRounds = 10

    constructor(
        private userRepository:userRepository,
        private userProfileRepository:UserProfileRepository
    ){}

    async execute(userData:{user_name:string; full_name:string;email:string;phone_number:Number;password:string}):Promise<User>{
    const existingUser = await this.userRepository.findByEmail(userData.email)
    const existingPhoneNumber = await this.userRepository.findByPhoneNumber(userData.phone_number)
    const isValidPassword = PasswordValidation.validate(userData.password)
    if(existingUser){
        throw new Error ('user already exists')
    }
    if(existingPhoneNumber){
        throw new Error ('This phone number is already registered')
    }
    if(!isValidPassword){
        throw new Error(PasswordValidation.getStrengthFeedback(userData.password))
    }
    const hashedPassword = await bcrypt.hash(userData.password,this.saltRounds)
    const user = new User('',userData.user_name,userData.full_name,userData.email,userData.phone_number,hashedPassword)
   await this.userRepository.save(user)

   const userProfile = new UserProfile(user.id,'','','prefer not to say',false,'Everyone',[],[],[],[],[],[])
   await this.userProfileRepository.save(userProfile)
   return user;
}
}