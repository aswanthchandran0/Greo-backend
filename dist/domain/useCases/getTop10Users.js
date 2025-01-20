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
exports.GetTopTenUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class GetTopTenUsers {
    constructor(userRepository, userGraphService) {
        this.userRepository = userRepository;
        this.userGraphService = userGraphService;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            // Step 1: Get top 10 users by follower count
            const topUsers = yield this.userGraphService.getTop10Users();
            // Step 2: Extract user IDs from top users
            const userIds = topUsers.map(user => new mongoose_1.default.Types.ObjectId(user.id));
            // Step 3: Fetch user details for these IDs
            const usersDetails = yield this.userRepository.findStackOfUser(userIds);
            // Step 4: Merge the follower count with the user details
            const result = topUsers.map(user => {
                const userDetails = usersDetails === null || usersDetails === void 0 ? void 0 : usersDetails.find(u => u.id.toString() === user.id);
                return {
                    _id: (userDetails === null || userDetails === void 0 ? void 0 : userDetails._id) || new mongoose_1.default.Types.ObjectId(), // Provide a default value
                    name: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.name) || "Unknown User", // Default to a string
                    profileImage: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.profileImage) || "",
                    user_name: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.user_name) || "",
                    email: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.email) || "",
                    user_bio: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.user_bio) || "",
                    lastseen_online: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.lastseen_online) || "Offline",
                    user_gender: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.user_gender) || "prefer not to say",
                    private_account: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.private_account) || false,
                    is_suspended: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.is_suspended) || false,
                    is_verified: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.is_verified) || false,
                    createdAt: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.createdAt) || new Date(),
                    followersCount: user.followersCount || 0, // Ensure it's a number
                };
            });
            const filteredResult = result.filter(user => {
                return (user.name !== "Unknown User" && // Exclude users with placeholder name
                    user.followersCount > 0);
            });
            console.log("Filtered result", filteredResult);
            return filteredResult;
        });
    }
}
exports.GetTopTenUsers = GetTopTenUsers;
