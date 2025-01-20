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
exports.AdminUserManagement = void 0;
class AdminUserManagement {
    constructor(adminUserManagementRepository) {
        this.adminUserManagementRepository = adminUserManagementRepository;
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminUserManagementRepository.getAllUsers();
        });
    }
    getUserById(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.adminUserManagementRepository.getUserById(user_id);
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagementRepository.updateUser(user);
        });
    }
    suspendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagementRepository.suspendUser(user_id);
        });
    }
    unsuSpendUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adminUserManagementRepository.unSuspendUser(user_id);
        });
    }
}
exports.AdminUserManagement = AdminUserManagement;
