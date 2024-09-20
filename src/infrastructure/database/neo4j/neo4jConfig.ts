import neo4j from "neo4j-driver";
import { config } from "../../../config/config";
import { error } from "console";

const driver = neo4j.driver(config.NEO4J_URL as string,neo4j.auth.basic(config.NEO4J_USERNAME as string,config.NEO4J_PASSWORD as string));


const  verifyConnection = async () =>{
    const session = driver.session()
    try{
      const result = await session.run("RETURN 1")
      if(result.records.length > 0){
          console.log('Neo4j connection verified sucessfully');
      }
    }catch(error){
        console.error("Neo4j connection verification failed",error);
        
    }finally{
        await session.close()
    }
}

verifyConnection()

export const getSession = () =>{
    return driver.session()
}

export {driver}