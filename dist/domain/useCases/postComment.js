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
exports.PostComment = void 0;
const comment_1 = require("../entities/comment");
class PostComment {
    constructor(commentRepository) {
        this.commentRepository = commentRepository;
    }
    execute(userId, postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const commentContent = new comment_1.CommentContent(userId, content, new Date());
            const comment = new comment_1.Comment(postId, [commentContent], new Date());
            const savedComment = yield this.commentRepository.save(comment);
            return savedComment;
        });
    }
}
exports.PostComment = PostComment;
