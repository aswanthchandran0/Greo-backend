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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
class AdminService {
    constructor(signinAdmin, adminUserManagement, getUserDetails, fetchReportedPosts, findStackOfUser, getTop10users, fetchAllPostsAndRolls, blockPost) {
        this.signinAdmin = signinAdmin;
        this.adminUserManagement = adminUserManagement;
        this.getUserDetails = getUserDetails;
        this.fetchReportedPosts = fetchReportedPosts;
        this.findStackOfUser = findStackOfUser;
        this.getTop10users = getTop10users;
        this.fetchAllPostsAndRolls = fetchAllPostsAndRolls;
        this.blockPost = blockPost;
    }
    signin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.signinAdmin.execute(email, password);
            if (!response) {
                throw new Error("Authentication failed");
            }
            return {
                admin: response.admin,
                tokens: response.tokens,
            };
        });
    }
    // admin User mangement
    getAllUser() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminUserManagement.getAllUsers();
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminUserManagement.getUserById(user_id);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagement.updateUser(user);
        });
    }
    suspendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagement.suspendUser(user_id);
        });
    }
    unSuspendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagement.unsuSpendUser(user_id);
        });
    }
    GetUserDetailsService(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUserDetails.execute(userId);
        });
    }
    GetReportedPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchReportedPosts.execute();
        });
    }
    FindStackOfUser(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findStackOfUser.execute(userIds);
        });
    }
    GetTop10Users() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getTop10users.execute();
        });
    }
    getPostsAndRoll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetchAllPostsAndRolls.execute();
        });
    }
    blockUserPost(postId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.blockPost.execute(postId, action);
        });
    }
}
exports.AdminService = AdminService;
