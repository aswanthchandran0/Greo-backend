"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RollLike = exports.Like = void 0;
class Like {
    constructor(id, userId, postIds, createdAt) {
        this.id = id;
        this.userId = userId;
        this.postIds = postIds;
        this.createdAt = createdAt;
    }
}
exports.Like = Like;
class RollLike {
    constructor(id, userId, rollIds, createdAt) {
        this.id = id;
        this.userId = userId;
        this.rollIds = rollIds;
        this.createdAt = createdAt;
    }
}
exports.RollLike = RollLike;
