import { cloudinary } from "../../infrastructure/externalServices/cloudinaryConfig";


export class CloudinaryService{
    async uploadToCloundinary(filePath:string[], folderName:string):Promise<any>{
   const uploadPromises = filePath.map((filePath)=>cloudinary.uploader.upload(filePath,{folder:folderName}))
   const results = await Promise.all(uploadPromises)
   return results
}
}