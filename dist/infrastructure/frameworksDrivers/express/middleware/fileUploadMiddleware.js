"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImageMiddleware = exports.uploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDistination = path_1.default.join(__dirname, '../../../../uploads/posts');
        if (!fs_1.default.existsSync(uploadDistination)) {
            fs_1.default.mkdirSync(uploadDistination, { recursive: true });
        }
        return cb(null, uploadDistination);
    },
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const profileImageStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDistination = path_1.default.join(__dirname, '../../../../uploads/profiles');
        if (!fs_1.default.existsSync(uploadDistination)) {
            fs_1.default.mkdirSync(uploadDistination, { recursive: true });
        }
        return cb(null, uploadDistination);
    },
    filename: (req, file, cb) => {
        return cb(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
    }
});
exports.uploadMiddleware = (0, multer_1.default)({ storage }).array('files');
exports.uploadSingleImageMiddleware = (0, multer_1.default)({ storage: profileImageStorage }).single('profileImage');
