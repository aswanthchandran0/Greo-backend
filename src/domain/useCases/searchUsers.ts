import { userRepository } from "../repositories/userRepository";

export class searchUsers{
    constructor(private userRepository:userRepository){}
    
    async execute(query:string){
     return await this.userRepository.searchUsers(query)
    }
}