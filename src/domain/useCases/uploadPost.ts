import fs from 'fs'
import { Post } from '../entities/post'
import { MediaType } from '../entities/post'
import { PostRepository } from '../repositories/postRepository'
import mongoose, { Schema } from 'mongoose'

export class UploadPost{
    constructor (private postRepository:PostRepository){}
   async execute(secureurl:string[],filesPaths:string[],userId:Schema.Types.ObjectId,mediaType:string,comment:string) {
       filesPaths.map((path)=>{
         fs.unlink(path,(error)=>{
            console.log(error)
         })
       })
       const postId = new Schema.Types.ObjectId('');
       const post = new Post(
        postId,
        userId,
        secureurl,
        mediaType as MediaType,
        comment,
        new Date(),
        new Date()
       )
       const savedPost = await this.postRepository.savePostData(post)
      return savedPost
      }  

}