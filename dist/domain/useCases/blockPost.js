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
exports.BlockPost = void 0;
class BlockPost {
    constructor(postRepository, emailService) {
        this.postRepository = postRepository;
        this.emailService = emailService;
    }
    execute(postId, action) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield this.postRepository.blockAndUnblockPost(postId, action);
            const postDetails = yield this.postRepository.getUserPostByPostId(postId);
            const email = (_a = postDetails === null || postDetails === void 0 ? void 0 : postDetails.email) !== null && _a !== void 0 ? _a : '';
            const subject = `Your Post Has Been ${action ? 'Blocked' : 'Unblocked'}`;
            let message = "";
            if (postDetails) {
                message = `
         Dear ${postDetails.name},

We hope this message finds you well.

This is to inform you that your post has been ${action ? "blocked" : "unblocked"} by our admin team. 

${action
                    ? "This action was taken due to violations of our community guidelines."
                    : "We have reviewed your post and determined that it no longer violates our community guidelines, so it has been unblocked."}

Below are the details of your post:

Post Content: ${postDetails.content || "No content"}
Post Image: ${postDetails.mediaUrls[0] || "No image available"}

If you believe this decision was made in error, or if you would like to appeal this action, please contact us at aswanthc26@gmail.com, and we will review your case.

Thank you for understanding.

Best regards,  
Greo Team

          `;
            }
            yield this.emailService.sendAdminMail(email, subject, message);
            return response;
        });
    }
}
exports.BlockPost = BlockPost;
