import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepositoryImpl } from "../../infrastructure/repositoryImpl/userRepositoryImpl";
import { UserService } from "../../application/services/userService";
import { UserGraphRepositoryImpl } from "../../infrastructure/repositoryImpl/userGraphRepsitoryImpl";
import { UserGraphService } from "../../application/services/userGraphService";
import { SignupUser } from "../../domain/useCases/signupUser";
import { RandomNameGenerator } from "../../application/services/randomNameGenerator";
import { SendOtp } from "../../domain/useCases/sentOtp";
import { OtpRepositoryImpl } from "../../infrastructure/repositoryImpl/otpRepositoryImpl";
import { EmailService } from "../../application/services/emailService";
import { VerifyOtp } from "../../domain/useCases/verifiOtp";
import { SigninUser } from "../../domain/useCases/signinUser";
import { SignUpWithGoogle } from "../../domain/useCases/signUpWithGoogle";
import { SignInWithGoogle } from "../../domain/useCases/signInWithGoogle";
import { GenerateForgotPasswordToken } from "../../domain/useCases/generateForgotPasswordToken";
import { UpdatePassword } from "../../domain/useCases/UpdatePassword";
import { ResentOtp } from "../../domain/useCases/resentOtp";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";
import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
import { authenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/userMiddleware/authMiddleware";
import { UpdateProfile } from "../../domain/useCases/updateProfile";
import { CloudinaryService } from "../../application/services/cloudnaryService";
import {
  uploadMiddleware,
  uploadSingleImageMiddleware,
} from "../../infrastructure/frameworksDrivers/express/middleware/fileUploadMiddleware";
import { CheckUserNameAvailabilty } from "../../domain/useCases/userNameAvailabilty";
import { UploadPost } from "../../domain/useCases/uploadPost";
import { GetUserFeed } from "../../domain/useCases/getUserFeed";
import { LikePost } from "../../domain/useCases/likePost";
import { UnlikePost } from "../../domain/useCases/unlikePost";
import { LikeRepositoryImpl } from "../../infrastructure/repositoryImpl/likeRepositoryImpl";
import { PostComment } from "../../domain/useCases/postComment";
import { commentRepositoryImpl } from "../../infrastructure/repositoryImpl/commentRepositoryImpl";
import { GetComments } from "../../domain/useCases/getComments";
import { roleBasedAuthentication } from "../../infrastructure/frameworksDrivers/express/middleware/adminMiddleware/rolebaseAuthMiddleware";
import { GetUserByUserId } from "../../domain/useCases/getUserByUserId";
import { getFollowers } from "../../domain/useCases/getFollowers";
import { RollUpload } from "../../domain/useCases/rollUpload";
import { RollRepositoryImpl } from "../../infrastructure/repositoryImpl/rollRepositoryImpl";
import { GetUserRoll } from "../../domain/useCases/getUserRoll";
import { RollGetComments } from "../../domain/useCases/rollGetComments";
import { RollCommentRepositoryImpl } from "../../infrastructure/repositoryImpl/rollCommentRepositoryImpl";
import { RollPostComment } from "../../domain/useCases/rollPostComment";
import { RollLikeRepositoryImpl } from "../../infrastructure/repositoryImpl/rollLikeRepositoryImpl";
import { RollLikePost } from "../../domain/useCases/rollLikePost";
import { RollUnlikePost } from "../../domain/useCases/rollUnlikePost";
import { fetchLatestRolls } from "../../domain/useCases/fetchLatestRoll";
import { DeletePost } from "../../domain/useCases/deletePost";
import { UpdatePost } from "../../domain/useCases/updatePost";
import { ReportPost } from "../../domain/useCases/reportPost";
import { searchUsers } from "../../domain/useCases/searchUsers";
import { GetLikedUsers } from "../../domain/useCases/getLikedUsers";
import { ExploreRepositoryImpl } from "../../infrastructure/repositoryImpl/exploreRepositoryImpl";
import { FetchForExpolore } from "../../domain/useCases/fetchForExplore";
import { GetSingelPost } from "../../domain/useCases/getSingelPost";
import { UserSavingRepositoryImpl } from "../../infrastructure/repositoryImpl/userSavingRepositoryImpl";
import { UserSaveItem } from "../../domain/useCases/userSaveItems";
import { DeleteSavedItem } from "../../domain/useCases/deleteSavedItem";
import { FindSavedItems } from "../../domain/useCases/findSavedItems";
import { NotificationRepositoryImp } from "../../infrastructure/repositoryImpl/NotificationRepositoryImpl";
import { SaveNotifcation } from "../../domain/useCases/saveNotification";
import { DeleteNotification } from "../../domain/useCases/deleteNotification";
import { GetUserNotification } from "../../domain/useCases/getUserNotification";
import { NotificationUpdate } from "../../domain/useCases/notificationUpdate";
import { DeleteRoll } from "../../domain/useCases/deleteRoll";
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

const router = Router();
const userRepository = new UserRepositoryImpl();
const userGraphRepository = new UserGraphRepositoryImpl();
const commentRepository = new commentRepositoryImpl();
const otpRepository = new OtpRepositoryImpl();
const rollRepository = new RollRepositoryImpl();
const rollCommentRepository = new RollCommentRepositoryImpl();
const rollLikeRepository = new RollLikeRepositoryImpl();
const exploreRepository = new ExploreRepositoryImpl();
const notificatonRepository = new NotificationRepositoryImp();

const userGraphService = new UserGraphService(userGraphRepository);
const randomNameGenerator = new RandomNameGenerator(userRepository);
const emailService = new EmailService();
const sentOtp = new SendOtp(otpRepository, emailService);
const signupUser = new SignupUser(userRepository, randomNameGenerator, sentOtp);
const verifyOtp = new VerifyOtp(otpRepository, userRepository);
const signinUser = new SigninUser(userRepository);
const signupWithGoogle = new SignUpWithGoogle(userRepository);
const signinWithGoogle = new SignInWithGoogle(userRepository);
const cloudinaryService = new CloudinaryService();
const generateForgotPasswordToken = new GenerateForgotPasswordToken(
  userRepository,
  emailService
);
const updatePassword = new UpdatePassword(userRepository);
const resentOtp = new ResentOtp(emailService, otpRepository, userRepository);
const postRepository = new PostRepositoryImpl();
const getUserProfile = new GetUserProfile(
  userRepository,
  postRepository,
  userGraphService
);
const updateProfile = new UpdateProfile(
  userRepository,
  cloudinaryService,
  userGraphService
);
const checkUsernameAvailability = new CheckUserNameAvailabilty(userRepository);
const uploadPost = new UploadPost(postRepository);
const getUserFeed = new GetUserFeed(postRepository, userGraphService);
const likeRepository = new LikeRepositoryImpl();
const userSavingRepository = new UserSavingRepositoryImpl();
const likePost = new LikePost(likeRepository);
const unlikePost = new UnlikePost(likeRepository);
const postComment = new PostComment(commentRepository);
const getComments = new GetComments(commentRepository);
const getUserByUserId = new GetUserByUserId(userRepository);
const getFollowersFollowing = new getFollowers(userRepository);
const rollUpload = new RollUpload(rollRepository, cloudinaryService);
const getUserRoll = new GetUserRoll(rollRepository);
const rollGetComments = new RollGetComments(rollCommentRepository);
const rollPostComment = new RollPostComment(rollCommentRepository);
const rollLikePost = new RollLikePost(rollLikeRepository);
const rollUnlikePost = new RollUnlikePost(rollLikeRepository);
const fetchLatesrolls = new fetchLatestRolls(rollRepository);
const deletePost = new DeletePost(postRepository);
const updatePost = new UpdatePost(postRepository);
const reportPost = new ReportPost(postRepository);
const searchUser = new searchUsers(userRepository);
const getLikedUsers = new GetLikedUsers(likeRepository);
const fetchForExplore = new FetchForExpolore(exploreRepository);
const getSingelPost = new GetSingelPost(postRepository);
const userSaveItem = new UserSaveItem(userSavingRepository);
const deleteSavedItem = new DeleteSavedItem(userSavingRepository);
const findSavedItem = new FindSavedItems(userSavingRepository);
const saveNotification = new SaveNotifcation(notificatonRepository);
const deleteNotification = new DeleteNotification(notificatonRepository);
const getUserNotification = new GetUserNotification(notificatonRepository);
const notificationUpdate = new NotificationUpdate(notificatonRepository);
const deleteRoll = new DeleteRoll(rollRepository);

const userService = new UserService(
  userRepository,
  signupUser,
  userGraphService,
  verifyOtp,
  signinUser,
  signupWithGoogle,
  signinWithGoogle,
  generateForgotPasswordToken,
  updatePassword,
  resentOtp,
  getUserProfile,
  updateProfile,
  checkUsernameAvailability,
  cloudinaryService,
  uploadPost,
  getUserFeed,
  likePost,
  unlikePost,
  postComment,
  getComments,
  getUserByUserId,
  getFollowersFollowing,
  rollUpload,
  getUserRoll,
  rollPostComment,
  rollGetComments,
  rollLikePost,
  rollUnlikePost,
  fetchLatesrolls,
  deletePost,
  updatePost,
  reportPost,
  searchUser,
  getLikedUsers,
  fetchForExplore,
  getSingelPost,
  userSaveItem,
  deleteSavedItem,
  findSavedItem,
  saveNotification,
  deleteNotification,
  getUserNotification,
  notificationUpdate,
  deleteRoll
);
const userController = new UserController(userService, userGraphService);
router.post("/user_signup", userController.signup.bind(userController));
router.post("/verify_otp", userController.verifyOtp.bind(userController));
router.post(
  "/signup_with_google",
  userController.signUpWithGoogle.bind(userController)
);
router.post("/user_signin", userController.signin.bind(userController));
router.post(
  "/signin_with_google",
  userController.signInWithGoogle.bind(userController)
);
router.post("/refresh_token", userController.refreshToken.bind(userController));
router.post(
  "/generate_forgot_password_token",
  userController.generateForgotPasswordToken.bind(userController)
);
router.patch(
  "/update_password",
  userController.updatePassword.bind(userController)
);
router.post("/resent_otp", userController.ResentOtp.bind(userController));
router.get(
  "/profile/:username",
  authenticateToken,
  userController.getUserProfile.bind(userController)
);
router.patch(
  "/update_profile",
  authenticateToken,
  uploadSingleImageMiddleware,
  userController.updateProfile.bind(userController)
);
router.get(
  "/check_username/:username",
  authenticateToken,
  userController.checkUsernameAvailability.bind(userController)
);
router.post(
  "/follow",
  authenticateToken,
  userController.followUser.bind(userController)
);
router.post(
  "/unfollow",
  authenticateToken,
  userController.unfollowUser.bind(userController)
);
router.post(
  "/post_upload",
  uploadMiddleware,
  userController.createPost.bind(userController)
);
router.get(
  "/user_feed/:skip/:limit",
  authenticateToken,
  userController.getUserfeed.bind(userController)
);
router.post(
  "/like_post",
  authenticateToken,
  userController.LikeUnLikePost.bind(userController)
);
router.post(
  "/post_comment",
  authenticateToken,
  userController.PostComment.bind(userController)
);
router.get(
  "/get_comments/:postId",
  authenticateToken,
  userController.GetComments.bind(userController)
);
router.get(
  "/get_user_by_id/:userId",
  authenticateToken,
  userController.getUserByUserId.bind(userController)
);
router.get(
  "/followers/:username",
  authenticateToken,
  userController.getFollowers.bind(userController)
);
router.get(
  "/following/:username",
  authenticateToken,
  userController.getFollowing.bind(userController)
);
router.post(
  "/roll",
  authenticateToken,
  userController.rollUpload.bind(userController)
);
router.delete(
  "/roll/:rollId",
  authenticateToken,
  userController.deleteRoll.bind(userController)
);
router.get(
  "/roll/:userId",
  authenticateToken,
  userController.getUserRoll.bind(userController)
);

router.post(
  "/roll_like_post",
  authenticateToken,
  userController.RollLikeUnLikePost.bind(userController)
);
router.post(
  "/roll_post_comment",
  authenticateToken,
  userController.RollPostComment.bind(userController)
);
router.get(
  "/roll_get_comments/:rollId",
  authenticateToken,
  userController.RollGetComments.bind(userController)
);
router.get(
  "/latest-roll/",
  authenticateToken,
  userController.fetchLatesRoll.bind(userController)
);
router.delete(
  "/post/:postId",
  authenticateToken,
  userController.deleteUserPost.bind(userController)
);
router.patch(
  "/post",
  authenticateToken,
  userController.updateUserPost.bind(userController)
);
router.post(
  "/report-post",
  authenticateToken,
  userController.reportPost.bind(userController)
);
router.get(
  "/users/:query",
  authenticateToken,
  userController.searchUsers.bind(userController)
);
router.get(
  "/likedUsers/:postId",
  authenticateToken,
  userController.getLikedUsers.bind(userController)
);

router.get(
  "/explore/:page/:pageSize",
  authenticateToken,
  (req, res, next) => {
    // Disable caching for this route
    res.setHeader("Cache-Control", "no-store");
    next();
  },
  userController.ExploreFetch.bind(userController)
);

router.get(
  "/post/:postId",
  authenticateToken,
  userController.GetSinglePost.bind(userController)
);

router.post(
  "/saveItem",
  authenticateToken,
  userController.saveUserItems.bind(userController)
);
router.delete(
  "/saveItem",
  authenticateToken,
  userController.deleteUserItems.bind(userController)
);
router.get(
  "/saveItem",
  authenticateToken,
  userController.findSavedItems.bind(userController)
);

router.get(
  "/notification",
  authenticateToken,
  userController.getUserNotification.bind(userController)
);
router.post(
  "/notification",
  authenticateToken,
  userController.SaveNotification.bind(userController)
);
router.delete(
  "/notification",
  authenticateToken,
  userController.DeleteNotfication.bind(userController)
);
router.patch(
  "/notification",
  authenticateToken,
  userController.updateNotification.bind(userController)
);

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
export default router;
