import { PostRepository } from "../../domain/repositories/postRepository";
import { PostModel } from "../database/mongo/models/postModel";
import { Post } from "../../domain/entities/post";
import { UserModel } from "../database/mongo/models/userModel";
import  Mongoose  from "mongoose";
import { Model,Types } from "mongoose";
import { userWithPosts } from "../../application/dto/userDto";
import { User } from "../../domain/entities/user";

export class PostRepositoryImpl implements PostRepository{
    async savePostData(postData: Post): Promise<any> {
     const post = new PostModel(postData)
     return await post.save()   
    }

    async getPostsWithDetails(ObjectUserId:Mongoose.Types.ObjectId): Promise<Post[] | null> {
        try{
        const posts  = await PostModel.aggregate([
            {
             $lookup:{
                from:'users',
                localField:'userId',
                foreignField:'_id',
                as:'user'
             }

            },
            {
                $unwind:'$user'
            },
            {
                $lookup:{
                    from:'likes',
                    localField:'_id',
                    foreignField:'postIds',
                    as:'likes'
                }
            },
            {
            $addFields:{
                totalLikes:{$size:'$likes'},
                isLiked:{$in:[ObjectUserId,'$likes.userId']}
            }
            },
           {
            $project:{
                _id:1,
                userId:1,
                username:"$user.user_name",
                userImage:"$user.profileImage",
                userBio:"$user.user_bio",
                mediaUrls:1,
                mediaType:1,
                content:1,
                createdAt:1,  
                updatedAt:1,
                totalLikes:1,
                isLiked:1
            }
           }
        ])
        console.log('posts details',posts)
        return posts
        }catch(err){
            console.log(err)
        return null
        }
       

    }

  async  getPostsByUserName(username: string): Promise<Post[] | null> {
    try{
        const user = await UserModel.findOne({user_name:username})
        if(user){
    const posts = await PostModel.find({userId:user._id})
    console.log('posts',posts)
    return posts
      }      
      return null 
    }catch(err){
        console.log('error:',err)
        throw new Error('something went wrong')
    }
     
    }

    async getPostsWithUserByUserName(userName: string): Promise<userWithPosts | null> {
       const user = await UserModel.findOne({user_name:userName})
       if(user){
        const posts = await PostModel.find({userId:user._id})
        const typedUser = user as User
        return {user: typedUser, posts:posts}
       }else{
        return null
       }
    }
}