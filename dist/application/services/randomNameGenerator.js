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
exports.RandomNameGenerator = void 0;
class RandomNameGenerator {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    uniqueNameGenerator(baseName_1) {
        return __awaiter(this, arguments, void 0, function* (baseName, maxRetries = 1000) {
            let uniqueName = baseName;
            let isAvailable = false;
            let retryCount = 0;
            while (!isAvailable) {
                const randomNum = Math.floor(Math.random() * 10000);
                uniqueName = `${baseName}${randomNum}`;
                const existedUserName = yield this.userRepository.findByUserName(uniqueName);
                if (!existedUserName && retryCount < maxRetries) {
                    isAvailable = true;
                }
                else {
                    retryCount++;
                }
            }
            if (!isAvailable) {
                throw new Error("Failed to generate a unique username after maximum retries.");
            }
            return uniqueName;
        });
    }
}
exports.RandomNameGenerator = RandomNameGenerator;
