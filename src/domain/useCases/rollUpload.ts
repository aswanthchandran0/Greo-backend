import { RollDto } from "../../application/dto/rollDto";
import { CloudinaryService } from "../../application/services/cloudnaryService";
import { RollRepository } from "../repositories/rollRepository";


export class RollUpload {
    constructor(
        private rollRepository:RollRepository,
        private cloudinaryService:CloudinaryService
    ){}
   async execute(userId:string, thumbnail:string,mediaUrl: string, content: string):Promise<RollDto>{
    const folderName = "user-rolls";
    const uploadedMedia = await this.cloudinaryService.uploadToCloudinary(mediaUrl, folderName)
    mediaUrl = uploadedMedia.secure_url;
    console.log('media url in rolll upload',mediaUrl)
      return this.rollRepository.save(userId,thumbnail,mediaUrl,content)
   }
}