import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepositoryImpl } from "../../infrastructure/repositoryImpl/userRepositoryImpl";
import { UserProfileRepository } from "../../domain/repositories/userProfileRepository";
import { SignupUser} from "../../domain/useCases/signupUser";
import { SigninUser } from "../../domain/useCases/signinUser";
import { UpdateUserProfile } from "../../domain/useCases/updateUserProfile";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";
import { UserService } from "../../application/services/userService";
import { userProfileRepositoryImpl } from "../../infrastructure/repositoryImpl/userProfileRepositoryImpl";
import { OtpRepositoryImpl } from "../../infrastructure/repositoryImpl/otpRepositoryImpl";
import { SendOtp } from "../../domain/useCases/sentOtp";
import { EmailService } from "../../application/services/emailService";
import { VerifyOtp } from "../../domain/useCases/verifiOtp";
import { SignUpWithGoogle } from "../../domain/useCases/signUpWithGoogle";
import { SignInWithGoogle } from "../../domain/useCases/signInWithGoogle";
import { authenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/authMiddleware";
import { uploadMiddleware, uploadSingleImageMiddleware } from "../../infrastructure/frameworksDrivers/express/middleware/fileUploadMiddleware";
import { CloudinaryService } from "../../application/services/cloudnaryService";
import { UploadPost } from "../../domain/useCases/uploadPost";
import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
import { GetPosts } from "../../domain/useCases/getPosts";
import { UnlikePost } from "../../domain/useCases/unlikePost";
import { LikePost } from "../../domain/useCases/likePost";
import { LikeRepositoryImpl } from "../../infrastructure/repositoryImpl/likeRepositoryImpl";
import { GetComments } from "../../domain/useCases/getComments";
import { commentRepositoryImpl } from "../../infrastructure/repositoryImpl/commentRepositoryImpl";
import { SentComment } from "../../domain/useCases/sentComment";
import { UserGraphRepositoryImpl } from "../../infrastructure/repositoryImpl/userGraphRepsitoryImpl";
import { UserGraphService } from "../../application/services/userGraphService";
import {getPostsWithUserByUserName} from "../../domain/useCases/getPostsWithUserByUsername"
import { GetUserByUserId } from "../../domain/useCases/getUserByUserId";

const router = Router() 
const  userRepository = new UserRepositoryImpl()
const userProfileRepository = new userProfileRepositoryImpl()
const otpRepository = new OtpRepositoryImpl()
const postRepository = new PostRepositoryImpl()
const likeRepository = new LikeRepositoryImpl();
const commentRepository = new commentRepositoryImpl()
const emailService = new EmailService()
const cloudinaryService = new CloudinaryService();
const uploadPost = new UploadPost(postRepository)
const signupWithGoogle = new SignUpWithGoogle(userRepository, userProfileRepository);
const signinWithGoogle = new SignInWithGoogle(userRepository)
const signupUser = new SignupUser(userRepository,userProfileRepository)
const signinUser = new SigninUser(userRepository)
const updateUserProfile = new UpdateUserProfile(userProfileRepository);
const getUserProfile = new GetUserProfile(userProfileRepository);
const sentOtp = new SendOtp(otpRepository,emailService)
const verifyUserOtp = new VerifyOtp(otpRepository)
const getPost = new GetPosts(postRepository)
const likePost = new LikePost(likeRepository);
const unlikePost = new UnlikePost(likeRepository)
const getComments = new GetComments(commentRepository)
const sentComment = new SentComment(commentRepository)
const targetedProfile = new getPostsWithUserByUserName(postRepository)
const userGraphRepository = new UserGraphRepositoryImpl()
const userGraphService = new UserGraphService(userGraphRepository)
const getUserByUserId = new GetUserByUserId(userRepository);
const userService = new UserService(signupUser,signinUser, getUserProfile,sentOtp,verifyUserOtp,signupWithGoogle,signinWithGoogle,cloudinaryService,uploadPost,
    getPost,likePost,unlikePost, getComments,sentComment,userRepository,userGraphService,postRepository,updateUserProfile,targetedProfile,getUserByUserId
)
const userController = new  UserController(userService,userGraphService)

router.post('/user_signup',userController.signup.bind(userController))
router.post('/user_signin',userController.signin.bind(userController))
router.get('/profile/:user_id',authenticateToken,userController.getProfile.bind(userController))
router.post('/signup_with_google',userController.signUpWithGoogle.bind(userController))
router.post('/signin_with_google',userController.signInWithGoogle.bind(userController))
router.post('/refresh_token',userController.refreshToken.bind(userController))
router.post('/post_upload',uploadMiddleware,userController.createPost.bind(userController))
router.get('/get_posts',authenticateToken, userController.GetPosts.bind(userController))
router.post('/like_post',authenticateToken,userController.LikeUnLikePost.bind(userController))
router.get('/get_comments/:postId',userController.GetComments.bind(userController))
router.post('/sent_comment',authenticateToken,userController.SentComment.bind(userController))
      
router.post('/follow',authenticateToken, userController.followUser.bind(userController));
router.post('/unfollow',authenticateToken, userController.unfollowUser.bind(userController));
router.get('/followers',authenticateToken, userController.getFollowers.bind(userController));
router.get('/following',authenticateToken, userController.getFollowing.bind(userController));
router.get('/get_user_posts/:username',userController.getPostsByUserName.bind(userController))
router.patch('/profile',uploadSingleImageMiddleware,userController.updateUserProfie.bind(userController))
router.get('/userProfile/:username',authenticateToken,userController.getUserProfileWithUser.bind(userController))
router.get('/get_user_by_id/:userId',userController.getUserByUserId.bind(userController))
export default router;  
  
  