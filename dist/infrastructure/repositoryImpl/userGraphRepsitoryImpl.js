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
exports.UserGraphRepositoryImpl = void 0;
const neo4jConfig_1 = require("../database/neo4j/neo4jConfig");
class UserGraphRepositoryImpl {
    createUserNode(userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            try {
                const query = `CREATE (u:User {id: $userId,name: $userName})`;
                yield session.run(query, { userId, userName });
            }
            finally {
                yield session.close();
            }
        });
    }
    followUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
      MATCH (f:User {id: $followerId}), (t:User {id: $followeeId})
      MERGE (f)-[:FOLLOWS] ->(t)
      `;
            try {
                yield session.run(query, { followerId, followeeId });
            }
            finally {
                yield session.close();
            }
        });
    }
    unfollowUser(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
         MATCH (f:User {id: $followerId}) -[r:FOLLOWS] -> (t:User {id:$followeeId})
         DELETE r
        `;
            try {
                yield session.run(query, { followerId, followeeId });
            }
            finally {
                yield session.close();
            }
        });
    }
    getFollowers(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
    MATCH (u:User {name: $username})<-[:FOLLOWS]-(f:User)
    RETURN f.id AS id
  `;
            try {
                const result = yield session.run(query, { username });
                return result.records.map(record => ({
                    id: record.get('id'),
                }));
            }
            finally {
                yield session.close();
            }
        });
    }
    getFollowing(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
        MATCH (u:User {name: $username})-[:FOLLOWS]->(f:User)
        RETURN f.id AS id
      `;
            try {
                const result = yield session.run(query, { username });
                return result.records.map(record => ({
                    id: record.get('id'),
                }));
            }
            finally {
                yield session.close();
            }
        });
    }
    getFollowersCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
        MATCH (u:User {id: $userId})<-[:FOLLOWS]-(f:User)
  RETURN COUNT(f) AS FollowersCount
      `;
            try {
                const result = yield session.run(query, { userId });
                const record = result.records[0];
                return record.get('FollowersCount').toInt();
            }
            finally {
                yield session.close();
            }
        });
    }
    getFollowingCount(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
      MATCH (u:User {id:$userId})-[:FOLLOWS]->(f:User)
      RETURN COUNT(f) AS FollowingCount
      `;
            try {
                const result = yield session.run(query, { userId });
                const record = result.records[0];
                return record.get('FollowingCount').toInt();
            }
            finally {
                yield session.close();
            }
        });
    }
    isFollowing(followerId, followeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
        MATCH (f:User {id:$followerId}) -[:FOLLOWS] -> (t:User {id:$followeeId})
        RETURN COUNT(*)>0 AS isFollowing
        `;
            try {
                const result = yield session.run(query, { followerId, followeeId });
                const record = result.records[0];
                return record.get('isFollowing');
            }
            finally {
                yield session.close();
            }
        });
    }
    updateUserName(userId, userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
      MATCH (u:User {id:$userId}) SET u.name = $userName
      `;
            try {
                yield session.run(query, { userId, userName });
            }
            finally {
                yield session.close();
            }
        });
    }
    getFollowingIds(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
      MATCH (u:User {id:$userId})-[:FOLLOWS]->(f:User)
      RETURN f.id as FollowingId
      `;
            try {
                const result = yield session.run(query, { userId });
                return result.records.map(record => record.get('FollowingId'));
            }
            finally {
                yield session.close();
            }
        });
    }
    getTop10UsersByFollowers() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = (0, neo4jConfig_1.getSession)();
            const query = `
        MATCH (u:User)<-[:FOLLOWS]-(f:User)
        WITH u, COUNT(f) AS followersCount
        ORDER BY followersCount DESC
        LIMIT 10
        RETURN u.id AS id, u.name AS name, followersCount
      `;
            try {
                const result = yield session.run(query);
                return result.records.map(record => ({
                    id: record.get('id'),
                    name: record.get('name'),
                    followersCount: record.get('followersCount').toInt(),
                }));
            }
            finally {
                yield session.close();
            }
        });
    }
}
exports.UserGraphRepositoryImpl = UserGraphRepositoryImpl;
