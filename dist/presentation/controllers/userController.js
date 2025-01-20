"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserController = void 0;
const tokenService_1 = __importDefault(require("../../application/services/tokenService"));
const mongoose_1 = __importStar(require("mongoose"));
const notification_1 = require("../../domain/entities/notification");
// // import { UserProfile } from "../../domain/entities/user";
// import { error } from "console";
// import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
// import mongoose from "mongoose";
// import { Schema } from "mongoose";
class UserController {
    constructor(userService, userGraphService) {
        this.userService = userService;
        this.userGraphService = userGraphService;
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const signupResponse = yield this.userService.signup(userData);
                res.status(201).json({
                    user: {
                        id: signupResponse.user.id,
                        name: signupResponse.user.name,
                        email: signupResponse.user.email,
                        user_name: signupResponse.user.user_name,
                    },
                    otpSent: signupResponse.otpSent,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, otpCode } = req.body;
                const isValid = yield this.userService.verifyOtp(userId, otpCode);
                if (isValid) {
                    const accessToken = tokenService_1.default.generateAccessToken(userId);
                    const refreshToken = tokenService_1.default.generateRefreshToken(userId);
                    res.status(200).json({
                        token: { accessToken: accessToken, refreshToken: refreshToken },
                    });
                }
                else {
                    res.status(400).json({ error: "Invalid OTP" });
                }
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email ||
                    !password ||
                    email.trim() === "" ||
                    password.trim() === "") {
                    throw new Error("email or password cannot be empty");
                }
                const SigninResponse = yield this.userService.signin(email, password);
                res.status(200).json({
                    user: {
                        id: SigninResponse.user.id,
                        name: SigninResponse.user.name,
                        profileImage: SigninResponse.user.profileImage,
                        user_name: SigninResponse.user.user_name,
                        email: SigninResponse.user.email,
                        user_bio: SigninResponse.user.user_bio,
                        lastseen_online: SigninResponse.user.lastseen_online,
                        password: SigninResponse.user.password,
                        user_gender: SigninResponse.user.user_gender,
                        private_account: SigninResponse.user.private_account,
                    },
                    tokens: SigninResponse.tokens,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    signUpWithGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, publicKey } = req.body;
                console.log(token);
                console.log(publicKey);
                const googleSignUpResponse = yield this.userService.googleSignup(token, publicKey);
                console.log("google sign up response", googleSignUpResponse);
                res.status(200).json({
                    user: {
                        id: googleSignUpResponse.user.id,
                        user_name: googleSignUpResponse.user.user_name,
                        name: googleSignUpResponse.user.name,
                        profileImage: googleSignUpResponse.user.profileImage,
                        email: googleSignUpResponse.user.email,
                    },
                    tokens: googleSignUpResponse.tokens,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    signInWithGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.body;
                const googleSignInResponse = yield this.userService.googleSignin(token);
                console.log("google sign in response", googleSignInResponse);
                res.status(200).json({
                    user: {
                        id: googleSignInResponse.user.id,
                        name: googleSignInResponse.user.name,
                        profileImage: googleSignInResponse.user.profileImage,
                        user_name: googleSignInResponse.user.user_name,
                        email: googleSignInResponse.user.email,
                        userBio: googleSignInResponse.user.user_bio,
                        lastseen_online: googleSignInResponse.user.lastseen_online,
                    },
                    tokens: googleSignInResponse.tokens,
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refreshToken } = req.body;
                const tokens = yield this.userService.refreshToken(refreshToken);
                res.status(200).json(tokens);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    generateForgotPasswordToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.userService.GenerateForgotPasswordToken(email);
                res.status(200).json({
                    sucess: true,
                    message: "Reset password link has been sent to your email.",
                });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    updatePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, password } = req.body;
                console.log('token password', token, password);
                yield this.userService.UpdatePassword(token, password);
                res
                    .status(200)
                    .json({ sucess: true, message: "Password updated successfully" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    ResentOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                yield this.userService.ResentOtp(email);
                res.status(200).json({ sucess: true, message: "Otp sent successfully" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getUserProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = req.params.username;
                const userId = req.user.userId;
                const profile = yield this.userService.GetUserProfile(userId, username);
                console.log("user profile", profile);
                res.status(200).json(profile);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    updateProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const userId = req.user.userId;
                userData.id = userId;
                const response = yield this.userService.updateUserProfile(userData);
                res.status(200).json(response);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    checkUsernameAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const username = req.params.username;
                const userId = req.user.userId;
                const response = yield this.userService.CheckUserNameAvailabilty(userId, username);
                if (response.exist)
                    res.status(409).json({ message: "Username already exists." });
                else
                    res.status(200).json({ message: "Username is available." });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    followUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { followerId, followeeId } = req.body;
                if (!followerId || !followeeId) {
                    throw new Error("failed to follow user");
                }
                yield this.userGraphService.followUser(followerId, followeeId);
                res.sendStatus(200);
            }
            catch (err) {
                console.log("error", err);
            }
        });
    }
    unfollowUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { followerId, followeeId } = req.body;
            yield this.userGraphService.unFollowUser(followerId, followeeId);
            res.sendStatus(200);
        });
    }
    getFollowers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const followers = yield this.userGraphService.getFollowers(username);
            const users = yield this.userService.getFollowerFollowings(followers);
            res.json(users);
        });
    }
    getFollowing(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = req.params.username;
            const following = yield this.userGraphService.getFollowing(username);
            const users = yield this.userService.getFollowerFollowings(following);
            res.json(users);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let paths = [];
                const userId = req.body.userId;
                const mediaType = req.body.mediaType;
                const comment = req.body.comment;
                const files = req.files;
                paths = files.map((file) => file.path);
                const result = yield this.userService.postUpload(paths, "posts", userId, mediaType, comment);
                res.status(201).json(result);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getUserfeed(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const skip = parseInt(req.params.skip, 10);
                const limit = parseInt(req.params.limit, 10);
                console.log("skip", skip);
                const feed = yield this.userService.GetUserFeed(userId, skip, limit);
                res.status(200).json(feed);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    LikeUnLikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { likeIds, unlikeIds } = req.body;
                console.log("likesIds,", likeIds);
                console.log("unlike ids,", unlikeIds);
                if (likeIds && likeIds.length > 0) {
                    yield this.userService.LikePosts(userId, likeIds);
                }
                if (unlikeIds && unlikeIds.length > 0) {
                    yield this.userService.UnlikePosts(userId, unlikeIds);
                }
                res.status(200).json({ message: "Like/Unlike successful" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    PostComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                console.log("user id in controller", userId);
                const { postId, content } = req.body;
                const comment = yield this.userService.PostComment(userId, postId, content);
                res.status(200).json(comment);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    GetComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                console.log("post id in get comments in user controller", postId);
                const ObjectPostId = new mongoose_1.default.Types.ObjectId(postId);
                const comments = yield this.userService.GetComments(ObjectPostId);
                res.status(200).json(comments);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    getUserByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const ObjectUserId = new mongoose_1.default.Types.ObjectId(userId);
                const response = yield this.userService.getUserByUserId(ObjectUserId);
                res.status(200).json(Object.assign({}, response));
            }
            catch (err) {
                console.log("error", err);
                res.status(400).json({ message: "failed to load the userDetails" });
            }
        });
    }
    rollUpload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("request from body", req.body);
                const { thumbnail, mediaUrl, content } = req.body;
                const userId = req.user.userId;
                const response = yield this.userService.rollUploadService(userId, thumbnail, mediaUrl, content);
                res.status(200).json(response);
            }
            catch (err) {
                console.log("error", err);
                res.status(400).json({ message: "failed to load the userDetails" });
            }
        });
    }
    getUserRoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                console.log("user id", userId);
                console.log("user id length:", userId.length); // Should be 24
                console.log("user id:", JSON.stringify(userId));
                const userObjId = new mongoose_1.default.Types.ObjectId(userId);
                const response = yield this.userService.getUserRollService(userObjId);
                res.status(200).json(response);
            }
            catch (err) {
                console.log("error", err);
                res.status(400).json({ message: "failed to load the userDetails" });
            }
        });
    }
    RollPostComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { rollId, content } = req.body;
                const rollComment = yield this.userService.RollPostComment(userId, rollId, content);
                res.status(200).json(rollComment);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    RollGetComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rollId = req.params.rollId;
                console.log("rollId ", rollId);
                const ObjectRollId = new mongoose_1.default.Types.ObjectId(rollId);
                const rollComments = yield this.userService.RollGetComments(ObjectRollId);
                res.status(200).json(rollComments);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    RollLikeUnLikePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { likeIds, unlikeIds } = req.body;
                console.log("likesIds,", likeIds);
                console.log("unlike ids,", unlikeIds);
                if (likeIds && likeIds.length > 0) {
                    yield this.userService.RollLikePosts(userId, likeIds);
                }
                if (unlikeIds && unlikeIds.length > 0) {
                    yield this.userService.RollUnlikePosts(userId, unlikeIds);
                }
                res.status(200).json({ message: "Like/Unlike successful" });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    fetchLatesRoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const ObjectUserId = new mongoose_1.default.Types.ObjectId(userId);
                const page = parseInt(req.query.page) || 1;
                const pageSize = parseInt(req.query.pageSize) || 10;
                const rolls = yield this.userService.FetchLatesRoll(ObjectUserId, page, pageSize);
                res.status(200).json({ success: true, data: rolls });
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
    }
    deleteUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = req.params.postId;
                console.log("post id", postId);
                const ObjectPostId = new mongoose_1.default.Types.ObjectId(postId);
                yield this.userService.deleteUserPost(ObjectPostId);
                res.status(200).json("post deleted");
            }
            catch (err) {
                res.status(400).json({ message: "failed to delete post" });
            }
        });
    }
    updateUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { postId, content } = req.body;
                const ObjectUserId = new mongoose_1.default.Types.ObjectId(userId);
                const ObjectPostId = new mongoose_1.default.Types.ObjectId(postId);
                const response = yield this.userService.updateUserPost(ObjectUserId, ObjectPostId, content);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    reportPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const { postId, reason } = req.body;
                const ObjectUserId = new mongoose_1.default.Types.ObjectId(userId);
                const ObjectPostId = new mongoose_1.default.Types.ObjectId(postId);
                const validReasons = [
                    "dislike",
                    "bullying",
                    "self_harm",
                    "violence",
                    "nudity",
                    "fraud",
                    "false_info",
                ];
                if (!validReasons.includes(reason)) {
                    res.status(400).json({ message: "Invalid report reason" });
                }
                const validReason = reason;
                this.userService.postReportingService(ObjectPostId, ObjectUserId, validReason);
                res.status(200).json({ message: "Post reported successfully" });
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    searchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { query } = req.params;
                const response = yield this.userService.SearchUsers(query);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    getLikedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.params;
                const response = yield this.userService.GetLikedUsers(new mongoose_1.default.Types.ObjectId(postId));
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    ExploreFetch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const page = parseInt(req.params.page, 10);
                const pageSize = parseInt(req.params.pageSize, 10);
                console.log("userid", userId);
                console.log("page", page);
                console.log("page size", pageSize);
                const response = yield this.userService.ExploreFetchservice(new mongoose_1.default.Types.ObjectId(userId), page, pageSize);
                console.log("response from there", response);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    GetSinglePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const postId = req.params.postId;
                const response = yield this.userService.GetSinglePost(new mongoose_1.default.Types.ObjectId(postId), new mongoose_1.default.Types.ObjectId(userId));
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: "failed to update post" });
            }
        });
    }
    saveUserItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const item = req.body;
                console.log("req ", req.body);
                const typedItem = {
                    itemId: item.itemId,
                    type: item.type,
                    collectionName: item.collectionName,
                };
                const response = yield this.userService.SaveItems(userId, typedItem);
                console.log("response", response);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err });
            }
        });
    }
    deleteUserItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId; // Extract the userId from the request (authentication)
                const { itemId, type } = req.query; // Destructure the itemId and type (post or roll) from the request body
                // Validate input
                if (!itemId || !type) {
                    res.status(400).json({ message: "ItemId and type are required" });
                    return;
                }
                const itemType = type;
                // Check if type is either 'post' or 'roll'
                if (typeof type !== "string" || (type !== "post" && type !== "roll")) {
                    res
                        .status(400)
                        .json({ message: "Invalid type, must be 'post' or 'roll'" });
                }
                // Call the use case to delete the item
                const result = yield this.userService.DeleteSavedItem(userId, itemId.toString(), itemType);
                if (result) {
                    res.status(200).json({ message: "Item deleted successfully" });
                }
                else {
                    res.status(404).json({ message: "Item not found or already deleted" });
                }
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    findSavedItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const response = yield this.userService.FindSavedItems(new mongoose_1.default.Types.ObjectId(userId));
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    SaveNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiatorId = req.user.userId;
                const { userId, mediaUrl, entityId, message, type, isRead } = req.body;
                if (initiatorId === userId) {
                    res.status(200).json(null);
                    return;
                }
                const firstMediaUrl = Array.isArray(mediaUrl) && mediaUrl.length > 0 ? mediaUrl[0] : mediaUrl;
                const notificationEntity = new notification_1.Notification(new mongoose_1.default.Types.ObjectId(userId), new mongoose_1.default.Types.ObjectId(initiatorId), firstMediaUrl, new mongoose_1.default.Types.ObjectId(entityId), message, type, isRead || false);
                console.log("notification entity", notificationEntity);
                const response = yield this.userService.SaveNotification(notificationEntity);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    DeleteNotfication(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const initiatorId = req.user.userId;
                const { userId, entityId, type } = req.body;
                const response = yield this.userService.DeleteNotifcation(new mongoose_1.Types.ObjectId(userId), new mongoose_1.Types.ObjectId(entityId), new mongoose_1.Types.ObjectId(initiatorId), type);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    getUserNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const response = yield this.userService.GetUserNotification(userId);
                console.log('users notification', response);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    updateNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.userId;
                const response = yield this.userService.updateNotification(new mongoose_1.Types.ObjectId(userId));
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
    deleteRoll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rollId = req.params.rollId;
                const response = yield this.userService.DeleteRoll(new mongoose_1.Types.ObjectId(rollId));
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res
                    .status(500)
                    .json({ message: "An error occurred while deleting the item" });
            }
        });
    }
}
exports.UserController = UserController;
