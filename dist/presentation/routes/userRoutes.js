"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const userRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/userRepositoryImpl");
const userService_1 = require("../../application/services/userService");
const userGraphRepsitoryImpl_1 = require("../../infrastructure/repositoryImpl/userGraphRepsitoryImpl");
const userGraphService_1 = require("../../application/services/userGraphService");
const signupUser_1 = require("../../domain/useCases/signupUser");
const randomNameGenerator_1 = require("../../application/services/randomNameGenerator");
const sentOtp_1 = require("../../domain/useCases/sentOtp");
const otpRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/otpRepositoryImpl");
const emailService_1 = require("../../application/services/emailService");
const verifiOtp_1 = require("../../domain/useCases/verifiOtp");
const signinUser_1 = require("../../domain/useCases/signinUser");
const signUpWithGoogle_1 = require("../../domain/useCases/signUpWithGoogle");
const signInWithGoogle_1 = require("../../domain/useCases/signInWithGoogle");
const generateForgotPasswordToken_1 = require("../../domain/useCases/generateForgotPasswordToken");
const UpdatePassword_1 = require("../../domain/useCases/UpdatePassword");
const resentOtp_1 = require("../../domain/useCases/resentOtp");
const getUserProfile_1 = require("../../domain/useCases/getUserProfile");
const postRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/postRepositoryImpl");
const authMiddleware_1 = require("../../infrastructure/frameworksDrivers/express/middleware/userMiddleware/authMiddleware");
const updateProfile_1 = require("../../domain/useCases/updateProfile");
const cloudnaryService_1 = require("../../application/services/cloudnaryService");
const fileUploadMiddleware_1 = require("../../infrastructure/frameworksDrivers/express/middleware/fileUploadMiddleware");
const userNameAvailabilty_1 = require("../../domain/useCases/userNameAvailabilty");
const uploadPost_1 = require("../../domain/useCases/uploadPost");
const getUserFeed_1 = require("../../domain/useCases/getUserFeed");
const likePost_1 = require("../../domain/useCases/likePost");
const unlikePost_1 = require("../../domain/useCases/unlikePost");
const likeRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/likeRepositoryImpl");
const postComment_1 = require("../../domain/useCases/postComment");
const commentRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/commentRepositoryImpl");
const getComments_1 = require("../../domain/useCases/getComments");
const getUserByUserId_1 = require("../../domain/useCases/getUserByUserId");
const getFollowers_1 = require("../../domain/useCases/getFollowers");
const rollUpload_1 = require("../../domain/useCases/rollUpload");
const rollRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/rollRepositoryImpl");
const getUserRoll_1 = require("../../domain/useCases/getUserRoll");
const rollGetComments_1 = require("../../domain/useCases/rollGetComments");
const rollCommentRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/rollCommentRepositoryImpl");
const rollPostComment_1 = require("../../domain/useCases/rollPostComment");
const rollLikeRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/rollLikeRepositoryImpl");
const rollLikePost_1 = require("../../domain/useCases/rollLikePost");
const rollUnlikePost_1 = require("../../domain/useCases/rollUnlikePost");
const fetchLatestRoll_1 = require("../../domain/useCases/fetchLatestRoll");
const deletePost_1 = require("../../domain/useCases/deletePost");
const updatePost_1 = require("../../domain/useCases/updatePost");
const reportPost_1 = require("../../domain/useCases/reportPost");
const searchUsers_1 = require("../../domain/useCases/searchUsers");
const getLikedUsers_1 = require("../../domain/useCases/getLikedUsers");
const exploreRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/exploreRepositoryImpl");
const fetchForExplore_1 = require("../../domain/useCases/fetchForExplore");
const getSingelPost_1 = require("../../domain/useCases/getSingelPost");
const userSavingRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/userSavingRepositoryImpl");
const userSaveItems_1 = require("../../domain/useCases/userSaveItems");
const deleteSavedItem_1 = require("../../domain/useCases/deleteSavedItem");
const findSavedItems_1 = require("../../domain/useCases/findSavedItems");
const NotificationRepositoryImpl_1 = require("../../infrastructure/repositoryImpl/NotificationRepositoryImpl");
const saveNotification_1 = require("../../domain/useCases/saveNotification");
const deleteNotification_1 = require("../../domain/useCases/deleteNotification");
const getUserNotification_1 = require("../../domain/useCases/getUserNotification");
const notificationUpdate_1 = require("../../domain/useCases/notificationUpdate");
const deleteRoll_1 = require("../../domain/useCases/deleteRoll");
// import { OtpRepositoryImpl } from "../../infrastructure/repositoryImpl/otpRepositoryImpl";
// import { SendOtp } from "../../domain/useCases/sentOtp";
// import { EmailService } from "../../application/services/emailService";
// import { authenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/userMiddleware/authMiddleware";
// import { GetPosts } from "../../domain/useCases/getPosts";
// import { LikeRepositoryImpl } from "../../infrastructure/repositoryImpl/likeRepositoryImpl";
// import { commentRepositoryImpl } from "../../infrastructure/repositoryImpl/commentRepositoryImpl";
// import { SentComment } from "../../domain/useCases/sentComment";
// import {getPostsWithUserByUserName} from "../../domain/useCases/getPostsWithUserByUsername"
// import { GetUserByUserId } from "../../domain/useCases/getUserByUserId";
// import { auth } from "neo4j-driver";
// import { UpdatePost } from "../../domain/useCases/updatePost";
// import { DeletePost } from "../../domain/useCases/deletePost";
const router = (0, express_1.Router)();
const userRepository = new userRepositoryImpl_1.UserRepositoryImpl();
const userGraphRepository = new userGraphRepsitoryImpl_1.UserGraphRepositoryImpl();
const commentRepository = new commentRepositoryImpl_1.commentRepositoryImpl();
const otpRepository = new otpRepositoryImpl_1.OtpRepositoryImpl();
const rollRepository = new rollRepositoryImpl_1.RollRepositoryImpl();
const rollCommentRepository = new rollCommentRepositoryImpl_1.RollCommentRepositoryImpl();
const rollLikeRepository = new rollLikeRepositoryImpl_1.RollLikeRepositoryImpl();
const exploreRepository = new exploreRepositoryImpl_1.ExploreRepositoryImpl();
const notificatonRepository = new NotificationRepositoryImpl_1.NotificationRepositoryImp();
const userGraphService = new userGraphService_1.UserGraphService(userGraphRepository);
const randomNameGenerator = new randomNameGenerator_1.RandomNameGenerator(userRepository);
const emailService = new emailService_1.EmailService();
const sentOtp = new sentOtp_1.SendOtp(otpRepository, emailService);
const signupUser = new signupUser_1.SignupUser(userRepository, randomNameGenerator, sentOtp);
const verifyOtp = new verifiOtp_1.VerifyOtp(otpRepository, userRepository);
const signinUser = new signinUser_1.SigninUser(userRepository);
const signupWithGoogle = new signUpWithGoogle_1.SignUpWithGoogle(userRepository);
const signinWithGoogle = new signInWithGoogle_1.SignInWithGoogle(userRepository);
const cloudinaryService = new cloudnaryService_1.CloudinaryService();
const generateForgotPasswordToken = new generateForgotPasswordToken_1.GenerateForgotPasswordToken(userRepository, emailService);
const updatePassword = new UpdatePassword_1.UpdatePassword(userRepository);
const resentOtp = new resentOtp_1.ResentOtp(emailService, otpRepository, userRepository);
const postRepository = new postRepositoryImpl_1.PostRepositoryImpl();
const getUserProfile = new getUserProfile_1.GetUserProfile(userRepository, postRepository, userGraphService);
const updateProfile = new updateProfile_1.UpdateProfile(userRepository, cloudinaryService, userGraphService);
const checkUsernameAvailability = new userNameAvailabilty_1.CheckUserNameAvailabilty(userRepository);
const uploadPost = new uploadPost_1.UploadPost(postRepository);
const getUserFeed = new getUserFeed_1.GetUserFeed(postRepository, userGraphService);
const likeRepository = new likeRepositoryImpl_1.LikeRepositoryImpl();
const userSavingRepository = new userSavingRepositoryImpl_1.UserSavingRepositoryImpl();
const likePost = new likePost_1.LikePost(likeRepository);
const unlikePost = new unlikePost_1.UnlikePost(likeRepository);
const postComment = new postComment_1.PostComment(commentRepository);
const getComments = new getComments_1.GetComments(commentRepository);
const getUserByUserId = new getUserByUserId_1.GetUserByUserId(userRepository);
const getFollowersFollowing = new getFollowers_1.getFollowers(userRepository);
const rollUpload = new rollUpload_1.RollUpload(rollRepository, cloudinaryService);
const getUserRoll = new getUserRoll_1.GetUserRoll(rollRepository);
const rollGetComments = new rollGetComments_1.RollGetComments(rollCommentRepository);
const rollPostComment = new rollPostComment_1.RollPostComment(rollCommentRepository);
const rollLikePost = new rollLikePost_1.RollLikePost(rollLikeRepository);
const rollUnlikePost = new rollUnlikePost_1.RollUnlikePost(rollLikeRepository);
const fetchLatesrolls = new fetchLatestRoll_1.fetchLatestRolls(rollRepository);
const deletePost = new deletePost_1.DeletePost(postRepository);
const updatePost = new updatePost_1.UpdatePost(postRepository);
const reportPost = new reportPost_1.ReportPost(postRepository);
const searchUser = new searchUsers_1.searchUsers(userRepository);
const getLikedUsers = new getLikedUsers_1.GetLikedUsers(likeRepository);
const fetchForExplore = new fetchForExplore_1.FetchForExpolore(exploreRepository);
const getSingelPost = new getSingelPost_1.GetSingelPost(postRepository);
const userSaveItem = new userSaveItems_1.UserSaveItem(userSavingRepository);
const deleteSavedItem = new deleteSavedItem_1.DeleteSavedItem(userSavingRepository);
const findSavedItem = new findSavedItems_1.FindSavedItems(userSavingRepository);
const saveNotification = new saveNotification_1.SaveNotifcation(notificatonRepository);
const deleteNotification = new deleteNotification_1.DeleteNotification(notificatonRepository);
const getUserNotification = new getUserNotification_1.GetUserNotification(notificatonRepository);
const notificationUpdate = new notificationUpdate_1.NotificationUpdate(notificatonRepository);
const deleteRoll = new deleteRoll_1.DeleteRoll(rollRepository);
const userService = new userService_1.UserService(userRepository, signupUser, userGraphService, verifyOtp, signinUser, signupWithGoogle, signinWithGoogle, generateForgotPasswordToken, updatePassword, resentOtp, getUserProfile, updateProfile, checkUsernameAvailability, cloudinaryService, uploadPost, getUserFeed, likePost, unlikePost, postComment, getComments, getUserByUserId, getFollowersFollowing, rollUpload, getUserRoll, rollPostComment, rollGetComments, rollLikePost, rollUnlikePost, fetchLatesrolls, deletePost, updatePost, reportPost, searchUser, getLikedUsers, fetchForExplore, getSingelPost, userSaveItem, deleteSavedItem, findSavedItem, saveNotification, deleteNotification, getUserNotification, notificationUpdate, deleteRoll);
const userController = new userController_1.UserController(userService, userGraphService);
router.post("/user_signup", userController.signup.bind(userController));
router.post("/verify_otp", userController.verifyOtp.bind(userController));
router.post("/signup_with_google", userController.signUpWithGoogle.bind(userController));
router.post("/user_signin", userController.signin.bind(userController));
router.post("/signin_with_google", userController.signInWithGoogle.bind(userController));
router.post("/refresh_token", userController.refreshToken.bind(userController));
router.post("/generate_forgot_password_token", userController.generateForgotPasswordToken.bind(userController));
router.patch("/update_password", userController.updatePassword.bind(userController));
router.post("/resent_otp", userController.ResentOtp.bind(userController));
router.get("/profile/:username", authMiddleware_1.authenticateToken, userController.getUserProfile.bind(userController));
router.patch("/update_profile", authMiddleware_1.authenticateToken, fileUploadMiddleware_1.uploadSingleImageMiddleware, userController.updateProfile.bind(userController));
router.get("/check_username/:username", authMiddleware_1.authenticateToken, userController.checkUsernameAvailability.bind(userController));
router.post("/follow", authMiddleware_1.authenticateToken, userController.followUser.bind(userController));
router.post("/unfollow", authMiddleware_1.authenticateToken, userController.unfollowUser.bind(userController));
router.post("/post_upload", fileUploadMiddleware_1.uploadMiddleware, userController.createPost.bind(userController));
router.get("/user_feed/:skip/:limit", authMiddleware_1.authenticateToken, userController.getUserfeed.bind(userController));
router.post("/like_post", authMiddleware_1.authenticateToken, userController.LikeUnLikePost.bind(userController));
router.post("/post_comment", authMiddleware_1.authenticateToken, userController.PostComment.bind(userController));
router.get("/get_comments/:postId", authMiddleware_1.authenticateToken, userController.GetComments.bind(userController));
router.get("/get_user_by_id/:userId", authMiddleware_1.authenticateToken, userController.getUserByUserId.bind(userController));
router.get("/followers/:username", authMiddleware_1.authenticateToken, userController.getFollowers.bind(userController));
router.get("/following/:username", authMiddleware_1.authenticateToken, userController.getFollowing.bind(userController));
router.post("/roll", authMiddleware_1.authenticateToken, userController.rollUpload.bind(userController));
router.delete("/roll/:rollId", authMiddleware_1.authenticateToken, userController.deleteRoll.bind(userController));
router.get("/roll/:userId", authMiddleware_1.authenticateToken, userController.getUserRoll.bind(userController));
router.post("/roll_like_post", authMiddleware_1.authenticateToken, userController.RollLikeUnLikePost.bind(userController));
router.post("/roll_post_comment", authMiddleware_1.authenticateToken, userController.RollPostComment.bind(userController));
router.get("/roll_get_comments/:rollId", authMiddleware_1.authenticateToken, userController.RollGetComments.bind(userController));
router.get("/latest-roll/", authMiddleware_1.authenticateToken, userController.fetchLatesRoll.bind(userController));
router.delete("/post/:postId", authMiddleware_1.authenticateToken, userController.deleteUserPost.bind(userController));
router.patch("/post", authMiddleware_1.authenticateToken, userController.updateUserPost.bind(userController));
router.post("/report-post", authMiddleware_1.authenticateToken, userController.reportPost.bind(userController));
router.get("/users/:query", authMiddleware_1.authenticateToken, userController.searchUsers.bind(userController));
router.get("/likedUsers/:postId", authMiddleware_1.authenticateToken, userController.getLikedUsers.bind(userController));
router.get("/explore/:page/:pageSize", authMiddleware_1.authenticateToken, (req, res, next) => {
    // Disable caching for this route
    res.setHeader("Cache-Control", "no-store");
    next();
}, userController.ExploreFetch.bind(userController));
router.get("/post/:postId", authMiddleware_1.authenticateToken, userController.GetSinglePost.bind(userController));
router.post("/saveItem", authMiddleware_1.authenticateToken, userController.saveUserItems.bind(userController));
router.delete("/saveItem", authMiddleware_1.authenticateToken, userController.deleteUserItems.bind(userController));
router.get("/saveItem", authMiddleware_1.authenticateToken, userController.findSavedItems.bind(userController));
router.get("/notification", authMiddleware_1.authenticateToken, userController.getUserNotification.bind(userController));
router.post("/notification", authMiddleware_1.authenticateToken, userController.SaveNotification.bind(userController));
router.delete("/notification", authMiddleware_1.authenticateToken, userController.DeleteNotfication.bind(userController));
router.patch("/notification", authMiddleware_1.authenticateToken, userController.updateNotification.bind(userController));
// const userService = new UserService(signupUser,signinUser, getUserProfile,sentOtp,verifyUserOtp,signupWithGoogle,signinWithGoogle,cloudinaryService,uploadPost,
//     getPost,likePost,unlikePost, getComments,sentComment,userRepository,userGraphService,postRepository,updateUserProfile,targetedProfile,getUserByUserId,updatePost,
//     deletePost
// )
// // const userProfileRepository = new userProfileRepositoryImpl()
// const otpRepository = new OtpRepositoryImpl()
// const postRepository = new PostRepositoryImpl()
// const commentRepository = new commentRepositoryImpl()
// const emailService = new EmailService()
// // const updateUserProfile = new UpdateUserProfile(userProfileRepository);
// // const getUserProfile = new GetUserProfile(userProfileRepository);
// const sentOtp = new SendOtp(otpRepository,emailService)
// const getPost = new GetPosts(postRepository)
// const sentComment = new SentComment(commentRepository)
// const targetedProfile = new getPostsWithUserByUserName(postRepository)
// const deletePost = new DeletePost(postRepository)
// router.get('/get_posts',authenticateToken, userController.GetPosts.bind(userController))
// router.get('/get_user_posts/:username',roleBasedAuthentication,userController.getPostsByUserName.bind(userController))
// router.patch('/profile',authenticateToken,uploadSingleImageMiddleware,userController.updateUserProfie.bind(userController))
exports.default = router;
