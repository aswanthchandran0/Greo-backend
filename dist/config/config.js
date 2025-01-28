"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    PORT: process.env.PORT,
    SOCKET_PORT: process.env.SOCKET_PORT,
    SOCKET_IO_SECRET_KEY: process.env.SOCKET_IO_SECRET_KEY,
    MONGO_URI: process.env.MONGO_URI,
    NEO4J_URL: process.env.NEO4J_URL,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME,
    NEO4J_PASSWORD: process.env.NEO4J_PASSWORD,
    MAIL_SERVICE: process.env.MAIL_SERVICE,
    MAIL_SERVICE_PASSWORD: process.env.MAIL_SERVICE_PASSWORD,
    CLIENT_SIDE_URL: process.env.CLIENT_SIDE_URL,
    PRODUCTION_CLIENT_SIDE_URL: process.env.PRODUCTION_CLIENT_SIDE_URL,
    PRODUCTION_CLIENT_SIDE_WWW_URL: process.env.PRODUCTION_CLIENT_SIDE_WWW_URL,
    GOOGLE_API_CLIENT_ID: process.env.GOOGLE_API_CLIENT_ID,
    MAIL_SERVICE_USER: process.env.MAIL_SERVICE_USER,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
};
