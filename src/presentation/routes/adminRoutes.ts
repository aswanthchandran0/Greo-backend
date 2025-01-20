import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminRepositoryImpl } from "../../infrastructure/repositoryImpl/adminRepositoryImpl";
import { SigninAdmin } from "../../domain/useCases/adminSignin";
import { AdminService } from "../../application/services/adminService";
import { AdminUserManagement } from "../../domain/useCases/adminUserManagement";
import { AdminUserManagementRepositoryImpl } from "../../infrastructure/repositoryImpl/adminUserManagementRepositoryImpl";
import { GetUserDetails } from "../../domain/useCases/getUserDetails";

import { adminAuthenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/adminMiddleware/adminAuthMiddleware";
import { authenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/userMiddleware/authMiddleware";
import { UserGraphRepositoryImpl } from "../../infrastructure/repositoryImpl/userGraphRepsitoryImpl";
import { UserRepositoryImpl } from "../../infrastructure/repositoryImpl/userRepositoryImpl";
import { PostRepositoryImpl } from "../../infrastructure/repositoryImpl/postRepositoryImpl";
import { UserGraphService } from "../../application/services/userGraphService";
import { FetchReportedPosts } from "../../domain/useCases/fetchReportedPost";
import { FindStackOfUser } from "../../domain/useCases/findStackOfUser";
import { GetTopTenUsers } from "../../domain/useCases/getTop10Users";
import { FetchPostsAndRolls } from "../../domain/useCases/fetchAllPostsAndRolls";
import { RollRepositoryImpl } from "../../infrastructure/repositoryImpl/rollRepositoryImpl";
import { BlockPost } from "../../domain/useCases/blockPost";
import { EmailService } from "../../application/services/emailService";

const router = Router();

// Dependency Initialization
const userGraphRepository = new UserGraphRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const postRepository = new PostRepositoryImpl();
const rollRepository = new RollRepositoryImpl()
const emailService = new EmailService()
const userGraphService = new UserGraphService(userGraphRepository);

const adminRepository = new AdminRepositoryImpl();
const adminUserManagementRepository = new AdminUserManagementRepositoryImpl();
const adminUserManagement = new AdminUserManagement(
  adminUserManagementRepository
);
const signinAdmin = new SigninAdmin(adminRepository);
const getReportedPosts = new FetchReportedPosts(postRepository);

const getUserDetails = new GetUserDetails(
  postRepository,
  userRepository,
  userGraphService
);

const findStacOfUser = new FindStackOfUser(userRepository)
const getTop10Users = new GetTopTenUsers(userRepository,userGraphService)
const fetchAllPostsAndRolls = new FetchPostsAndRolls(postRepository,rollRepository)
const blockPost  = new BlockPost(postRepository,emailService)

const adminService = new AdminService(
  signinAdmin,
  adminUserManagement,
  getUserDetails,
  getReportedPosts,
  findStacOfUser,
  getTop10Users,
 fetchAllPostsAndRolls,
 blockPost
);

const adminController = new AdminController(adminService);

router.post("/authenticate", adminController.signin.bind(adminController));
router.get(
  "/users",
  adminAuthenticateToken,
  adminController.getAllUser.bind(adminController)
);
router.get(
  "/users/:userId",
  adminAuthenticateToken,
  adminController.getUserById.bind(adminController)
);
router.put(
  "/users/:user_id",
  adminAuthenticateToken,
  adminController.updateUser.bind(adminController)
);
router.post(
  "/users/suspend",
  adminAuthenticateToken,
  adminController.suspendUser.bind(adminController)
);
router.post(
  "/users/unSuspend",
  adminAuthenticateToken,
  adminController.unSuspendUser.bind(adminController)
);

router.get(
  "/userDetails/:userId",
  adminAuthenticateToken,
  adminController.getUserDetails.bind(adminController)
);

router.get(
  "/reportedPosts",
  adminAuthenticateToken,
  adminController.getReportedPost.bind(adminController)
);

router.post("/stackOfusers",adminAuthenticateToken,adminController.getStackOfUser.bind(adminController))
router.get("/top10Users",adminAuthenticateToken,adminController.GetTop10Users.bind(adminController))
router.get("/rollsAndPosts",adminAuthenticateToken,adminController.FetchAllPostsAndRolls.bind(adminController))
router.patch("/users",adminAuthenticateToken,adminController.BlockUserPost.bind(adminController))

export default router;
