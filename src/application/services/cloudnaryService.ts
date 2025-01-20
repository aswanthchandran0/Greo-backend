import { cloudinary } from "../../infrastructure/externalServices/cloudinaryConfig";

export class CloudinaryService {
  async uploadToCloudinary(filePaths: string | string[], folderName: string): Promise<any> {

    if (typeof filePaths !== "string" && !Array.isArray(filePaths)) {
        console.log('file paths',filePaths)
        throw new Error("filePaths must be a string or an array of strings.");
      }

    if (typeof filePaths === 'string' ) {
      if (filePaths.startsWith('data:video/')) {
        const uploadResponse = await cloudinary.uploader.upload(
          filePaths, 
          {
            resource_type: 'video', // Specify video type
            folder: folderName,
          }
        );
        return uploadResponse;
      } else {
        const uploadResponse = await cloudinary.uploader.upload(filePaths, { folder: folderName });
        return uploadResponse;
      }
    }

    const uploadPromises = filePaths.map((filePath) => {
      if (filePath.startsWith('data:video/')) {
        return cloudinary.uploader.upload(filePath, {
          resource_type: 'video',
          folder: folderName,
        });
      } else {
        return cloudinary.uploader.upload(filePath, { folder: folderName });
      }
    });

    const results = await Promise.all(uploadPromises);
    return results;
  }
}
