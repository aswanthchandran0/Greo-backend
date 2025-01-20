"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
class Post {
    constructor(id, userId, mediaUrls, mediaType, content, createdAt, updatedAt) {
        this.id = id;
        this.userId = userId;
        this.mediaUrls = mediaUrls;
        this.mediaType = mediaType;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.Post = Post;
