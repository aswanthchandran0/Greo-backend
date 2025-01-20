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
exports.UserRepositoryImpl = void 0;
const user_1 = require("../../domain/entities/user");
const userModel_1 = require("../database/mongo/models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
class UserRepositoryImpl {
    save(user, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = new userModel_1.UserModel(user);
            const savedUserModel = yield userModel.save({ session });
            return new user_1.User(savedUserModel._id, savedUserModel.name, savedUserModel.profileImage, savedUserModel.user_name, savedUserModel.email, savedUserModel.user_bio, savedUserModel.lastseen_online, savedUserModel.password, savedUserModel.user_gender, savedUserModel.private_account, savedUserModel.is_suspended, savedUserModel.is_verified);
        });
    }
    findByEmail(email, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = yield userModel_1.UserModel.findOne({ email })
                .session(session !== null && session !== void 0 ? session : null)
                .exec();
            return userModel
                ? new user_1.User(userModel._id, userModel.name, userModel.profileImage, userModel.user_name, userModel.email, userModel.user_bio, userModel.lastseen_online, userModel.password, userModel.user_gender, userModel.private_account, userModel.is_suspended, userModel.is_verified)
                : null;
        });
    }
    findByUserName(userName, session) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.UserModel.findOne({ user_name: userName })
                .session(session !== null && session !== void 0 ? session : null)
                .exec();
            return user
                ? new user_1.User(user._id, user.name, user.profileImage, user.user_name, user.email, user.user_bio, user.lastseen_online, user.password, user.user_gender, user.private_account, user.is_suspended, user.is_verified)
                : null;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.UserModel.findById(userId).exec();
            return user
                ? new user_1.User(user._id, user.name, user.profileImage, user.user_name, user.email, user.user_bio, user.lastseen_online, user.password, user.user_gender, user.private_account, user.is_suspended, user.is_verified)
                : null;
        });
    }
    updatePassword(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield userModel_1.UserModel.findByIdAndUpdate(userId, { password }).exec();
        });
    }
    updateUser(userId, updateField) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.UserModel.findByIdAndUpdate(userId, updateField, { new: true }).exec();
            return user
                ? new user_1.User(user._id, user.name, user.profileImage, user.user_name, user.email, user.user_bio, user.lastseen_online, user.password, user.user_gender, user.private_account, user.is_suspended, user.is_verified)
                : null;
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.findByIdAndDelete(userId).exec();
        });
    }
    getArrayOfUsers(followers) {
        return __awaiter(this, void 0, void 0, function* () {
            const userObjIds = followers.map((follower) => new mongoose_1.default.Types.ObjectId(follower.id));
            const users = yield userModel_1.UserModel.find({ _id: { $in: userObjIds } });
            return users.length > 0
                ? users.map((user) => new user_1.User(user._id, user.name, user.profileImage, user.user_name, user.email, user.user_bio, user.lastseen_online, user.password, user.user_gender, user.private_account, user.is_suspended, user.is_verified))
                : null;
        });
    }
    searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.UserModel.find({
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { user_name: { $regex: query, $options: "i" } },
                    ]
                })
                    .select("-password")
                    .exec();
                return users;
            }
            catch (error) {
                console.error("Error searching users:", error);
                throw new Error("Something went wrong");
            }
        });
    }
    findStackOfUser(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('user ids in repository', userIds);
            const users = yield userModel_1.UserModel.find({ _id: { $in: userIds } });
            return users;
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
