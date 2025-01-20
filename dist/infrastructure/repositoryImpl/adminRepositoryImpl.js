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
exports.AdminRepositoryImpl = void 0;
const admin_1 = require("../../domain/entities/admin");
const adminModel_1 = require("../database/mongo/models/adminModel");
class AdminRepositoryImpl {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = yield adminModel_1.AdminModel.findOne({ email }).exec();
            return adminModel ?
                new admin_1.Admin(adminModel.id, adminModel.admin_name, adminModel.email, adminModel.password) : null;
        });
    }
    save(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = new adminModel_1.AdminModel(admin);
            yield adminModel.save();
        });
    }
}
exports.AdminRepositoryImpl = AdminRepositoryImpl;
