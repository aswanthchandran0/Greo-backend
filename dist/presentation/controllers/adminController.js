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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const mongoose_1 = __importStar(require("mongoose"));
class AdminController {
    constructor(adminservice) {
        this.adminservice = adminservice;
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const response = yield this.adminservice.signin(email, password);
                console.log("response", response);
                res.status(200).json({
                    admin: {
                        id: response.admin._id,
                        admin_name: response.admin.admin_name,
                        email: response.admin.email,
                    },
                    token: response.tokens,
                });
            }
            catch (err) {
                console.log(err);
                const errorMessage = err.message || "An error occured";
                res.status(400).json({ error: errorMessage });
            }
        });
    }
    getAllUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.adminservice.getAllUser();
                console.log("users in admin controller", users);
                res.status(200).json(users);
            }
            catch (err) {
                res.status(500).json({ message: err }.message);
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.user_id;
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                console.log("user id", userObjectId);
                const user = yield this.adminservice.getUserById(userObjectId);
                if (user) {
                    res.status(200).json(user);
                }
                else {
                    res.status(404).json({ error: "User not found" });
                }
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                yield this.adminservice.updateUser(userData);
                res.status(200).json({ message: "User Updated Sucessfully" });
            }
            catch (err) {
                res.status(500).json({ Message: err.message });
            }
        });
    }
    suspendUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                console.log("user id", userId);
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                yield this.adminservice.suspendUser(userObjectId);
                res.status(200).json({ message: "User suspended sucessfully" });
            }
            catch (err) {
                console.log(err);
                res.status(500).json({ message: err.message });
            }
        });
    }
    unSuspendUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.body.userId;
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                yield this.adminservice.unSuspendUser(userObjectId);
                res.status(200).json({ message: "User unsuspended sucessfully" });
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    getUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                const response = yield this.adminservice.GetUserDetailsService(userObjectId);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    getReportedPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminservice.GetReportedPosts();
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    getStackOfUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userIds } = req.body;
                const ObjectUserId = userIds.map((userId) => new mongoose_1.default.Types.ObjectId(userId));
                const response = yield this.adminservice.FindStackOfUser(ObjectUserId);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    GetTop10Users(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminservice.GetTop10Users();
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    FetchAllPostsAndRolls(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.adminservice.getPostsAndRoll();
                console.log("response", response);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
    BlockUserPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId, action } = req.body;
                console.log("postid", postId);
                console.log("action", action);
                const response = yield this.adminservice.blockUserPost(new mongoose_1.Types.ObjectId(postId), action);
                console.log("response ", response);
                res.status(200).json(response);
            }
            catch (err) {
                console.log(err);
                res.status(400).json({ message: err.message });
            }
        });
    }
}
exports.AdminController = AdminController;
