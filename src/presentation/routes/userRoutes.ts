import { Router } from "express";
import { UserController } from "../controllers/userController";
import { UserRepositoryImpl } from "../../infrastructure/repositoryImpl/userRepositoryImpl";
import { UserProfileRepository } from "../../domain/repositories/userProfileRepository";
import { SignupUser} from "../../domain/useCases/signupUser";
import { SigninUser } from "../../domain/useCases/signinUser";
import { UpdateUserProfile } from "../../domain/useCases/userProfile";
import { GetUserProfile } from "../../domain/useCases/getUserProfile";
import { UserService } from "../../application/services/userService";
import { userProfileRepositoryImpl } from "../../infrastructure/repositoryImpl/userProfileRepositoryImpl";

const router = Router() 
const  userRepository = new UserRepositoryImpl()
const userProfileRepository = new userProfileRepositoryImpl()

const signupUser = new SignupUser(userRepository)
const signinUser = new SigninUser(userRepository)
const updateUserProfile = new UpdateUserProfile(userProfileRepository);
const getUserProfile = new GetUserProfile(userProfileRepository);

const userService = new UserService(signupUser,signinUser,updateUserProfile, getUserProfile)
const userController = new  UserController(userService)

router.post('/user_signup',userController.signup.bind(userController))
router.post('/user_signin',userController.signin.bind(userController))
router.put('/profile',userController.updateProfile.bind(userController))
router.get('/profile/:user_id',userController.getProfile.bind(userController))
export default router;