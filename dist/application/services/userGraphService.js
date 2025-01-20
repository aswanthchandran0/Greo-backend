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
exports.UserGraphService = void 0;
class UserGraphService {
    constructor(userGraphRepository) {
        this.userGraphRepository = userGraphRepository;
    }
    createUser(userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userGraphRepository.createUserNode(userId, userName);
        });
    }
    followUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userGraphRepository.followUser(followerId, followeeId);
        });
    }
    unFollowUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userGraphRepository.unfollowUser(followerId, followeeId);
        });
    }
    getFollowers(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getFollowers(username);
        });
    }
    getFollowing(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getFollowing(username);
        });
    }
    getFollowersCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getFollowersCount(userId);
        });
    }
    getFollowingCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getFollowingCount(userId);
        });
    }
    isFollowing(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.isFollowing(followerId, followeeId);
        });
    }
    updateUserName(userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userGraphRepository.updateUserName(userId, userName);
        });
    }
    getFollowingIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getFollowingIds(userId);
        });
    }
    getTop10Users() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userGraphRepository.getTop10UsersByFollowers();
        });
    }
}
exports.UserGraphService = UserGraphService;
