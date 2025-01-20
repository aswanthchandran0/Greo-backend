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
exports.UserService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tokenService_1 = __importDefault(require("./tokenService"));
// import { User, UserProfile } from "../../domain/entities/user";
// import { GetUserProfile } from "../../domain/useCases/getUserProfile";
// import { SendOtp } from "../../domain/useCases/sentOtp";
// import { GetPosts } from "../../domain/useCases/getPosts";
// import { SentComment } from "../../domain/useCases/sentComment";
// import { PostRepository } from "../../domain/repositories/postRepository";
// import { UpdateUserProfile } from "../../domain/useCases/updateUserProfile";
// import tokenService from "./tokenService";
// import { Post } from "../../domain/entities/post";
// import { UpdatePost } from "../../domain/useCases/updatePost";
// import { DeletePost } from "../../domain/useCases/deletePost";
class UserService {
    constructor(userReposiory, signupUser, userGraphService, verifyUserOtp, signinUser, signupWithGoogle, signinWithGoogle, generateForgotPasswordToken, updatePassword, resentOtp, getUserProfile, updateProfile, checkUserNameAvailabilty, cloudinaryService, uploadPost, getUserFeed, likePostUseCase, unlikePostUseCase, postComment, getComments, getUserByUserid, getFollowers, rollUpload, getUserRoll, rollPostComment, rollGetComment, rollLikePosts, rollUnlikePosts, fetchLatesRolls, deletePost, updatePost, reportPost, searchUsers, getLikedUsers, fetchForExplore, getSinglePost, userSaveItems, deleteSavedItem, findSavedItems, saveNotification, deleteNotification, getUserNotification, notificationUpdate, delteRoll
    //         private getUserProfile:GetUserProfile,
    ) {
        this.userReposiory = userReposiory;
        this.signupUser = signupUser;
        this.userGraphService = userGraphService;
        this.verifyUserOtp = verifyUserOtp;
        this.signinUser = signinUser;
        this.signupWithGoogle = signupWithGoogle;
        this.signinWithGoogle = signinWithGoogle;
        this.generateForgotPasswordToken = generateForgotPasswordToken;
        this.updatePassword = updatePassword;
        this.resentOtp = resentOtp;
        this.getUserProfile = getUserProfile;
        this.updateProfile = updateProfile;
        this.checkUserNameAvailabilty = checkUserNameAvailabilty;
        this.cloudinaryService = cloudinaryService;
        this.uploadPost = uploadPost;
        this.getUserFeed = getUserFeed;
        this.likePostUseCase = likePostUseCase;
        this.unlikePostUseCase = unlikePostUseCase;
        this.postComment = postComment;
        this.getComments = getComments;
        this.getUserByUserid = getUserByUserid;
        this.getFollowers = getFollowers;
        this.rollUpload = rollUpload;
        this.getUserRoll = getUserRoll;
        this.rollPostComment = rollPostComment;
        this.rollGetComment = rollGetComment;
        this.rollLikePosts = rollLikePosts;
        this.rollUnlikePosts = rollUnlikePosts;
        this.fetchLatesRolls = fetchLatesRolls;
        this.deletePost = deletePost;
        this.updatePost = updatePost;
        this.reportPost = reportPost;
        this.searchUsers = searchUsers;
        this.getLikedUsers = getLikedUsers;
        this.fetchForExplore = fetchForExplore;
        this.getSinglePost = getSinglePost;
        this.userSaveItems = userSaveItems;
        this.deleteSavedItem = deleteSavedItem;
        this.findSavedItems = findSavedItems;
        this.saveNotification = saveNotification;
        this.deleteNotification = deleteNotification;
        this.getUserNotification = getUserNotification;
        this.notificationUpdate = notificationUpdate;
        this.delteRoll = delteRoll;
    }
    signup(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const signUpResponse = yield this.signupUser.execute(userData);
                if (signUpResponse && signUpResponse.user.id) {
                    yield this.userGraphService.createUser(signUpResponse.user.id.toString(), userData.name);
                }
                yield session.commitTransaction();
                return signUpResponse;
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("failed signup process, rolling back:", error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    verifyOtp(userId, otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.verifyUserOtp.execute(userId, otpCode);
        });
    }
    signin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signinUser.execute(email, password);
        });
    }
    googleSignup(token, publicKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const googleSignUpResponse = yield this.signupWithGoogle.execute(token, session, publicKey);
                if (googleSignUpResponse && googleSignUpResponse.user.id) {
                    yield this.userGraphService.createUser(googleSignUpResponse.user.id.toString(), googleSignUpResponse.user.user_name);
                }
                yield session.commitTransaction();
                return googleSignUpResponse;
            }
            catch (error) {
                yield session.abortTransaction();
                console.error("failed google signup process, rolling back:", error);
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    googleSignin(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.signinWithGoogle.execute(token);
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return tokenService_1.default.refreshTokens(refreshToken);
        });
    }
    GenerateForgotPasswordToken(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.generateForgotPasswordToken.execute(email);
        });
    }
    UpdatePassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updatePassword.execute(token, password);
        });
    }
    ResentOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.resentOtp.execute(email);
        });
    }
    GetUserProfile(userId, username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getUserProfile.execute(userId, username);
        });
    }
    updateUserProfile(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updateProfile.execute(userData);
        });
    }
    CheckUserNameAvailabilty(userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.checkUserNameAvailabilty.execute(userId, userName);
        });
    }
    postUpload(filesPaths, folderName, userId, mediaType, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaUrls = yield this.cloudinaryService.uploadToCloudinary(filesPaths, folderName);
            const secureUrl = mediaUrls.map((file) => file.secure_url);
            return this.uploadPost.execute(secureUrl, filesPaths, userId, mediaType, comment);
        });
    }
    GetUserFeed(userId, skip, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getUserFeed.execute(userId, skip, limit);
        });
    }
    LikePosts(userId, postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.likePostUseCase.execute(userId, postIds);
        });
    }
    UnlikePosts(userId, postIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.unlikePostUseCase.execute(userId, postIds);
        });
    }
    PostComment(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.postComment.execute(userId, postId, content);
        });
    }
    GetComments(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getComments.execute(postId);
        });
    }
    getUserByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUserByUserid.execute(userId);
        });
    }
    getFollowerFollowings(followers) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getFollowers.execute(followers);
        });
    }
    rollUploadService(userId, thumbnail, mediaUrl, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rollUpload.execute(userId, thumbnail, mediaUrl, content);
        });
    }
    getUserRollService(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUserRoll.execute(userId);
        });
    }
    RollPostComment(userId, rollId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rollPostComment.execute(userId, rollId, content);
        });
    }
    RollGetComments(rollId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rollGetComment.execute(rollId);
        });
    }
    RollLikePosts(userId, rollIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rollLikePosts.execute(userId, rollIds);
        });
    }
    RollUnlikePosts(userId, rollIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.rollUnlikePosts.execute(userId, rollIds);
        });
    }
    FetchLatesRoll(viewingUserId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchLatesRolls.execute(viewingUserId, page, pageSize);
        });
    }
    deleteUserPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deletePost.execute(postId);
        });
    }
    updateUserPost(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.updatePost.execute(userId, postId, content);
        });
    }
    postReportingService(postId, userId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.reportPost.execute(postId, userId, reason);
        });
    }
    SearchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.searchUsers.execute(query);
        });
    }
    GetLikedUsers(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getLikedUsers.execute(productId);
        });
    }
    ExploreFetchservice(viewingUserId, page, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('userid', viewingUserId);
            console.log('page', page);
            console.log('page size', pageSize);
            return yield this.fetchForExplore.execute(viewingUserId, page, pageSize);
        });
    }
    GetSinglePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getSinglePost.execute(postId, userId);
        });
    }
    SaveItems(userId, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userSaveItems.execute(userId, item);
        });
    }
    DeleteSavedItem(userId, itemId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteSavedItem.execute(userId, itemId, type);
        });
    }
    FindSavedItems(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findSavedItems.execute(userId);
        });
    }
    SaveNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.saveNotification.execute(notificationData);
        });
    }
    DeleteNotifcation(userId, entityId, initiatorId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.deleteNotification.execute(userId, entityId, initiatorId, type);
        });
    }
    GetUserNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUserNotification.execute(userId);
        });
    }
    updateNotification(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.notificationUpdate.execute(userId);
        });
    }
    DeleteRoll(rollId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.delteRoll.execute(rollId);
        });
    }
}
exports.UserService = UserService;
