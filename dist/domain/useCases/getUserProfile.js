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
exports.GetUserProfile = void 0;
class GetUserProfile {
    constructor(userRepository, postRepository, userGraphService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.userGraphService = userGraphService;
    }
    execute(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.findByUserName(username);
                if (!user)
                    throw new Error('Sorry, we couldn’t find the user.');
                if (userId == (user === null || user === void 0 ? void 0 : user.id)) {
                    const posts = yield this.postRepository.getUserPosts(user.id);
                    const followersCount = yield this.userGraphService.getFollowersCount(user.id.toString());
                    const followingCount = yield this.userGraphService.getFollowingCount(user.id.toString());
                    return {
                        user: {
                            otherUser: false,
                        },
                        posts,
                        followersCount,
                        followingCount,
                    };
                }
                else {
                    const otherUser = yield this.userRepository.findByUserId(user.id);
                    const posts = yield this.postRepository.getUserPosts(user.id);
                    const followersCount = yield this.userGraphService.getFollowersCount(user.id.toString());
                    const followingCount = yield this.userGraphService.getFollowingCount(user.id.toString());
                    const isFollowing = yield this.userGraphService.isFollowing(userId.toString(), user.id.toString());
                    console.log('posts', posts);
                    return {
                        user: Object.assign(Object.assign({}, otherUser), { otherUser: true }),
                        posts,
                        followersCount,
                        followingCount,
                        isFollowing,
                    };
                }
            }
            catch (error) {
                console.log('error', error);
            }
        });
    }
}
exports.GetUserProfile = GetUserProfile;
