import { graphUser } from "../../application/dto/userDto"
import { User } from "../entities/user"

export interface IUserGraphRepository{
    createUserNode(userId:string,userName:string):Promise<void>
    followUser(followerId:string,followeeId:string):Promise<void>
    unfollowUser(followerId:string,followeeId:string):Promise<void>
    getFollowers(userId:string):Promise<graphUser[]>
    getFollowing(userId:string):Promise<graphUser[]>
    getFollowersCount(userId:string):Promise<number>
    getFollowingCount(userId:string):Promise<number>
    isFollowing(followerId:string,followeeId:string):Promise<boolean>
}