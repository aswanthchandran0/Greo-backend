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
exports.UpdateProfile = void 0;
class UpdateProfile {
    constructor(userRepository, cloudinaryService, userGraphService) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.userGraphService = userGraphService;
    }
    execute(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userData.id === undefined)
                throw new Error("user id is required");
            const user = yield this.userRepository.findByUserId(userData.id);
            if (!user)
                throw new Error("user not found");
            const forUpdate = Object.fromEntries(Object.entries(userData).filter(([key, value]) => value));
            console.log('forupdate', forUpdate);
            if (forUpdate.user_name) {
                console.log('request was reaching in this condition');
                yield this.userGraphService.updateUserName(userData.id.toString(), forUpdate.user_name.toString());
            }
            if (forUpdate.profileImage) {
                let profileImageUrl = yield this.cloudinaryService.uploadToCloudinary([forUpdate.profileImage], "profile");
                forUpdate.profileImage = profileImageUrl[0]
                    ? profileImageUrl[0].secure_url
                    : null;
            }
            return yield this.userRepository.updateUser(user.id, forUpdate);
        });
    }
}
exports.UpdateProfile = UpdateProfile;
