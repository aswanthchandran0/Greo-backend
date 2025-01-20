"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleBasedAuthentication = void 0;
const authMiddleware_1 = require("../userMiddleware/authMiddleware");
const adminAuthMiddleware_1 = require("./adminAuthMiddleware");
const roleBasedAuthentication = (req, res, next) => {
    (0, authMiddleware_1.authenticateToken)(req, res, (err) => {
        if (err) {
            console.log('error', err);
            return (0, adminAuthMiddleware_1.adminAuthenticateToken)(req, res, next);
        }
        next();
    });
};
exports.roleBasedAuthentication = roleBasedAuthentication;
