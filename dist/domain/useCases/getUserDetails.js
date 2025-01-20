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
exports.GetUserDetails = void 0;
class GetUserDetails {
    constructor(postRepository, userRepository, userGraphService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.userGraphService = userGraphService;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByUserId(userId);
            if (!user) {
                throw new Error('user not found');
            }
            const posts = yield this.postRepository.getUserPosts(userId);
            const followersCount = yield this.userGraphService.getFollowersCount(userId.toString());
            const followingCount = yield this.userGraphService.getFollowersCount(userId.toString());
            return {
                user: user,
                posts: posts,
                followersCount: followersCount,
                followingCount: followingCount
            };
        });
    }
}
exports.GetUserDetails = GetUserDetails;
