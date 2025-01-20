"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
class Admin {
    constructor(_id, admin_name, email, password) {
        this._id = _id;
        this.admin_name = admin_name;
        this.email = email;
        this.password = password;
    }
}
exports.Admin = Admin;
