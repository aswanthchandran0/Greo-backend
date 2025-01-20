"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinaryConfig_1 = require("../../infrastructure/externalServices/cloudinaryConfig");
class CloudinaryService {
    uploadToCloudinary(filePaths, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof filePaths !== "string" && !Array.isArray(filePaths)) {
                console.log('file paths', filePaths);
                throw new Error("filePaths must be a string or an array of strings.");
            }
            if (typeof filePaths === 'string') {
                if (filePaths.startsWith('data:video/')) {
                    const uploadResponse = yield cloudinaryConfig_1.cloudinary.uploader.upload(filePaths, {
                        resource_type: 'video', // Specify video type
                        folder: folderName,
                    });
                    return uploadResponse;
                }
                else {
                    const uploadResponse = yield cloudinaryConfig_1.cloudinary.uploader.upload(filePaths, { folder: folderName });
                    return uploadResponse;
                }
            }
            const uploadPromises = filePaths.map((filePath) => {
                if (filePath.startsWith('data:video/')) {
                    return cloudinaryConfig_1.cloudinary.uploader.upload(filePath, {
                        resource_type: 'video',
                        folder: folderName,
                    });
                }
                else {
                    return cloudinaryConfig_1.cloudinary.uploader.upload(filePath, { folder: folderName });
                }
            });
            const results = yield Promise.all(uploadPromises);
            return results;
        });
    }
}
exports.CloudinaryService = CloudinaryService;
