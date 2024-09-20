import { query } from "express";
import { IUserGraphRepository } from "../../domain/repositories/userGraphRepository";
import { getSession } from "../database/neo4j/neo4jConfig";
import { User } from "../../domain/entities/user";
import { graphUser } from "../../application/dto/userDto";
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
      console.log('followerId in grap impl',followerId)
      console.log('followeeId in grap impl',followeeId)
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
    async getFollowers(userId: string): Promise<graphUser[]> {
      const session = getSession();
  const query = `
    MATCH (u:User {id: $userId})<-[:FOLLOWS]-(f:User)
    RETURN f.id AS id, f.name AS name
  `;
  try {
    const result = await session.run(query, { userId });
    return result.records.map(record => ({
      id: record.get('id'),
      name: record.get('name')
    }));
  } finally {
    await session.close();
  }
    }
  
    async getFollowing(userId: string): Promise<graphUser[]> {
      const session = getSession();
      const query = `
        MATCH (u:User {id: $userId})-[:FOLLOWS]->(f:User)
        RETURN f.id AS id, f.name AS name
      `;
      try {
        const result = await session.run(query, { userId });
        return result.records.map(record => ({
          id: record.get('id'),
          name: record.get('name')
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
        session.close()
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
          session.close()
        }
    }
}