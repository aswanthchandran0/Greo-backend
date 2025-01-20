
import { FetchPostsAndRollsDto } from "../../application/dto/postsAndRollsDto";
import { PostRepository } from "../repositories/postRepository";
import { RollRepository } from "../repositories/rollRepository";


  
export class FetchPostsAndRolls{
    constructor(
        private postRepository:PostRepository,
        private rollRepository:RollRepository
    ){}

 async execute():Promise<FetchPostsAndRollsDto>{
    const posts = await this.postRepository.getAllPosts()
    const rolls = await this.rollRepository.getAllRoll()

    return {
        posts,
        rolls
    }
 }
}