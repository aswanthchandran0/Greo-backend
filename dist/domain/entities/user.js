"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, name, profileImage, user_name, email, user_bio, lastseen_online, password, user_gender, private_account, is_suspended, is_verified, createdAt) {
        this.id = id;
        this.name = name;
        this.profileImage = profileImage;
        this.user_name = user_name;
        this.email = email;
        this.user_bio = user_bio;
        this.lastseen_online = lastseen_online;
        this.password = password;
        this.user_gender = user_gender;
        this.private_account = private_account;
        this.is_suspended = is_suspended;
        this.is_verified = is_verified;
        this.createdAt = createdAt;
    }
}
exports.User = User;
