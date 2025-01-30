import { query } from "express";
import { IUserGraphRepository } from "../../domain/repositories/userGraphRepository";
import { getSession } from "../database/neo4j/neo4jConfig";
import { User } from "../../domain/entities/user";
import { graphUser, TopFollowerUser } from "../../application/dto/userDto";
export class UserGraphRepositoryImpl implements IUserGraphRepository{
    async createUserNode(userId:string,userName:string):Promise<void>{
      const session = getSession()
      
      try{   
        const query = `CREATE (u:User {id: $userId,name: $userName})`
        await session.run(query,{userId,userName})
      } finally{
        await session.close()
      }
    
    }

    async followUser(followerId: string, followeeId: string): Promise<void> {
      const session = getSession()
      const query =  `
      MATCH (f:User {id: $followerId}), (t:User {id: $followeeId})
      MERGE (f)-[:FOLLOWS] ->(t)
      ` 
     try{
        await session.run(query,{followerId,followeeId})
     }finally{
      await session.close()
     }
     
    }
  
    async unfollowUser(followerId: string, followeeId: string): Promise<void> {
      const session = getSession()
      const query = `
         MATCH (f:User {id: $followerId}) -[r:FOLLOWS] -> (t:User {id:$followeeId})
         DELETE r
        ` 
        try{
          await session.run(query,{followerId,followeeId})
        }finally{
          await session.close()
        }
    }
    async getFollowers(username: string): Promise<graphUser[]> {
      const session = getSession();
  const query = `
    MATCH (u:User {name: $username})<-[:FOLLOWS]-(f:User)
    RETURN f.id AS id
  `;
  try {
    const result = await session.run(query, { username });
    return result.records.map(record => ({
      id: record.get('id'),
    }));
  } finally {
    await session.close();
  }
    }
  
    async getFollowing(username: string): Promise<graphUser[]> {
      const session = getSession();
      const query = `
        MATCH (u:User {name: $username})-[:FOLLOWS]->(f:User)
        RETURN f.id AS id
      `;
      try {
        const result = await session.run(query, { username });
        return result.records.map(record => ({
          id: record.get('id'),
        }));
      } finally {
        await session.close();
      }
    }
    

    async getFollowersCount(userId:string):Promise<number>{
      const session  = getSession()
      const query  = `
        MATCH (u:User {id: $userId})<-[:FOLLOWS]-(f:User)
  RETURN COUNT(f) AS FollowersCount
      `
      try{
      const result = await session.run(query,{userId})
      const record = result.records[0]
      return record.get('FollowersCount').toInt()
      }finally{
        await session.close()
      }
    }

    async getFollowingCount(userId:string):Promise<number>{
      const session = getSession()
      const query = `
      MATCH (u:User {id:$userId})-[:FOLLOWS]->(f:User)
      RETURN COUNT(f) AS FollowingCount
      `                        
      try{
       const result = await session.run(query,{userId})
       const record = result.records[0]
       return record.get('FollowingCount').toInt()
      }finally{
       await session.close()
      }
    }

    async isFollowing(followerId:string,followeeId:string):Promise<boolean>{
      const session = getSession()
        const query = `
        MATCH (f:User {id:$followerId}) -[:FOLLOWS] -> (t:User {id:$followeeId})
        RETURN COUNT(*)>0 AS isFollowing
        `
        try{
       const result = await session.run(query,{followerId,followeeId})
       const record = result.records[0]
       return record.get('isFollowing')
        }finally{
       await  session.close()
        }
    }

    async updateUserName(userId:string,userName:string):Promise<void>{
      const session = getSession()
      const query = `
      MATCH (u:User {id:$userId}) SET u.name = $userName
      `
      try{
        await session.run(query,{userId,userName})
      }finally{
       await session.close()
      }
    }

    async getFollowingIds(userId:string):Promise<string[]>{
      const session = getSession()
      const query = `
      MATCH (u:User {id:$userId})-[:FOLLOWS]->(f:User)
      RETURN f.id as FollowingId
      `
      try{
       const result = await session.run(query,{userId})
       return result.records.map(record => record.get('FollowingId'))
      }finally{
      await session.close()
      }
    }


    async getTop10UsersByFollowers(): Promise<TopFollowerUser[]> {
      const session = getSession();
      const query = `
        MATCH (u:User)<-[:FOLLOWS]-(f:User)
        WITH u, COUNT(f) AS followersCount
        ORDER BY followersCount DESC
        LIMIT 10
        RETURN u.id AS id, u.name AS name, followersCount
      `;
      try {
        const result = await session.run(query);
        return result.records.map(record => ({
          id: record.get('id'),
          name: record.get('name'),
          followersCount: record.get('followersCount').toInt(),
        }));
      } finally {
        await session.close();
      }
    }
    

    
    
}