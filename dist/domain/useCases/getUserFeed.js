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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserFeed = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class GetUserFeed {
    constructor(postRepository, graphService) {
        this.postRepository = postRepository;
        this.graphService = graphService;
    }
    execute(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const followedUserIds = yield this.graphService.getFollowingIds(userId.toString());
            const followedUserObjectIds = followedUserIds.map(id => new mongoose_1.default.Types.ObjectId(id));
            return this.postRepository.getPostsByFollowing(userId, followedUserObjectIds, skip, limit);
        });
    }
}
exports.GetUserFeed = GetUserFeed;
