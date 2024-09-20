import { IUserGraphRepository } from "../../domain/repositories/userGraphRepository";
import { User } from "../../domain/entities/user";
import { graphUser } from "../dto/userDto";
export class UserGraphService{
 constructor (private readonly userGraphRepository:IUserGraphRepository){}

 async createUser(userId:string,userName:string):Promise<void>{
  await this.userGraphRepository.createUserNode(userId,userName)
 }

 
 async followUser(followerId:string,followeeId:string):Promise<void>{
  await this.userGraphRepository.followUser(followerId,followeeId)
}

async unFollowUser(followerId:string,followeeId:string):Promise<void>{
  await this.userGraphRepository.unfollowUser(followerId,followeeId)
}

async getFollowers(userId:string):Promise<graphUser[]>{
  return this.userGraphRepository.getFollowers(userId)
}
async getFollowing(userId:string):Promise<graphUser[]>{
  return this.userGraphRepository.getFollowing(userId)
}

async getFollowersCount(userId:string):Promise<number>{   
  return this.userGraphRepository.getFollowersCount(userId)

}

async getFollowingCount(userId:string):Promise<number>{
  return this.userGraphRepository.getFollowingCount(userId) 
}

async isFollowing(followerId:string,followeeId:string):Promise<boolean>{
  return this.userGraphRepository.isFollowing(followerId,followeeId)    
}

}