import {UserProfile } from "../entities/user";

export interface UserProfileRepository{
    save(userProfile:UserProfile):Promise<void>,
    findByUserId(user_id:string):Promise<UserProfile|null>,
    update(userProfile:UserProfile):Promise<void>
}