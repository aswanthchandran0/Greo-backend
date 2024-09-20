import { PostRepository } from "../repositories/postRepository";


export class getPostsWithUserByUserName{
    constructor(private postRepository:PostRepository){}

    async execute(userName:string){
     return await this.postRepository.getPostsWithUserByUserName(userName)
    }
}