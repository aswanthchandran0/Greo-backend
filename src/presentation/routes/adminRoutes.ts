import { Router } from "express";
import { AdminController } from "../controllers/adminController";
import { AdminRepositoryImpl } from "../../infrastructure/repositoryImpl/adminRepositoryImpl";
import { SigninAdmin } from "../../domain/useCases/adminSignin";
import { AdminService } from "../../application/services/adminService";
import { AdminUserManagement } from "../../domain/useCases/adminUserManagement";
import { AdminUserManagementRepositoryImpl } from "../../infrastructure/repositoryImpl/adminUserManagementRepositoryImpl";

const router  = Router()

const adminRepository = new AdminRepositoryImpl()
const adminUserManagementRepository = new AdminUserManagementRepositoryImpl()
const adminUserManagement = new AdminUserManagement(adminUserManagementRepository)   
const signinAdmin = new SigninAdmin(adminRepository)
const adminService = new AdminService(signinAdmin,adminUserManagement)
const adminController = new AdminController(adminService)
import { adminAuthenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/adminMiddleware/adminAuthMiddleware";
import { authenticateToken } from "../../infrastructure/frameworksDrivers/express/middleware/userMiddleware/authMiddleware";
      
router.post('/authenticate',adminController.signin.bind(adminController))
router.get('/users',adminAuthenticateToken,adminController.getAllUser.bind(adminController))
router.get('/users/:user_id',adminAuthenticateToken,adminController.getUserById.bind(adminController))
router.put('/users/:user_id',adminAuthenticateToken,adminController.updateUser.bind(adminController))
router.post('/users/suspend',adminAuthenticateToken,adminController.suspendUser.bind(adminController))
router.post('/users/unSuspend',adminAuthenticateToken,adminController.unSuspendUser.bind(adminController))

export default router

 