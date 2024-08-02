import { User } from "../entities/user";

export interface userRepository{
    save(user:User): Promise<void>;
    findByEmail(email:string): Promise<User|null>
    findByPhoneNumber(phone_number:Number):Promise<User|null>
    
}