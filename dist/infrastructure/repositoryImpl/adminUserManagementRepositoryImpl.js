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
exports.AdminUserManagementRepositoryImpl = void 0;
const user_1 = require("../../domain/entities/user");
const userModel_1 = require("../database/mongo/models/userModel");
const userMapper_1 = require("../mappers/userMapper");
class AdminUserManagementRepositoryImpl {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const userDocs = yield userModel_1.UserModel.find().exec();
            console.log('user docs', userDocs);
            return userDocs.map((doc) => {
                return new user_1.User(doc._id, doc.name, doc.profileImage, doc.user_name, doc.email, doc.user_bio, doc.lastseen_online, doc.password, doc.user_gender, doc.private_account, doc.is_suspended, doc === null || doc === void 0 ? void 0 : doc.publicKey, doc === null || doc === void 0 ? void 0 : doc.createdAt);
            });
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield userModel_1.UserModel.findById(user_id).exec();
            return userDoc ? userMapper_1.UserMapper.toUser(userDoc) : null;
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.findByIdAndUpdate(user.id, userMapper_1.UserMapper.fromUser(user)).exec();
        });
    }
    suspendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.findByIdAndUpdate(user_id, { is_suspended: true }).exec();
        });
    }
    unSuspendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.UserModel.findByIdAndUpdate(user_id, { is_suspended: false }).exec();
        });
    }
}
exports.AdminUserManagementRepositoryImpl = AdminUserManagementRepositoryImpl;
