import { IFollowers } from "../../application/dto/userDto";
import { userRepository } from "../repositories/userRepository";



export class getFollowers {
    constructor(
        private userRepository:userRepository
    ){}

   async execute(followers:IFollowers[]){
     return await this.userRepository.getArrayOfUsers(followers)
   }
}