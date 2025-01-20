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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String },
    profileImage: { type: String },
    user_name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    user_bio: { type: String },
    lastseen_online: {
        type: String,
        enum: ["Everyone", "private", "hide"],
        default: "Everyone",
    },
    password: { type: String, required: true },
    user_gender: {
        type: String,
        enum: ["prefer not to say", "male", "female"],
        default: "prefer not to say",
    },
    private_account: { type: Boolean, default: false },
    is_suspended: { type: Boolean, default: false },
    is_verified: { type: Boolean, default: false },
    publicKey: { type: String },
    createdAt: { type: Date, default: Date.now }
});
exports.UserModel = mongoose_1.default.model("user", userSchema);
