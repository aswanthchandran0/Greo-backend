"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMapper = void 0;
const user_1 = require("../../domain/entities/user");
const userModel_1 = require("../database/mongo/models/userModel");
class UserMapper {
    static toUser(doc) {
        return new user_1.User(doc._id.toString(), doc.name, doc.profileImage, doc.user_name, doc.email, doc.user_bio, doc.lastseen_online, doc.password, doc.user_gender, doc.private_account, doc.is_suspended, doc.is_verified);
    }
    static toUserList(doc) {
        return doc.map(this.toUser);
    }
    static fromUser(user) {
        return new userModel_1.UserModel({
            _id: user.id,
            user_name: user.user_name,
            email: user.email,
            password: user.password,
            is_suspended: user.is_suspended
        });
    }
}
exports.UserMapper = UserMapper;
