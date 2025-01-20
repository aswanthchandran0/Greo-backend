"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollComment = exports.Comment = exports.CommentContent = void 0;
// Class to represent individual comment content
class CommentContent {
    constructor(userId, content, createdAt) {
        this.userId = userId;
        this.content = content;
        this.createdAt = createdAt;
    }
}
exports.CommentContent = CommentContent;
// Class to represent the main comment document
class Comment {
    constructor(postId, comments, // Array of CommentContent
    createdAt) {
        this.postId = postId;
        this.comments = comments;
        this.createdAt = createdAt;
    }
}
exports.Comment = Comment;
class RollComment {
    constructor(rollId, comments, // Array of CommentContent
    createdAt) {
        this.rollId = rollId;
        this.comments = comments;
        this.createdAt = createdAt;
    }
}
exports.RollComment = RollComment;
