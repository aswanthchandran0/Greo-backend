import { userRepository } from "../../domain/repositories/userRepository";

export class RandomNameGenerator{
   constructor (private userRepository:userRepository){}
  async uniqueNameGenerator(baseName:string, maxRetries: number = 1000):Promise<String>{
    let uniqueName = baseName;
    let isAvailable = false;
    let retryCount = 0;
    while (!isAvailable) {
        const randomNum = Math.floor(Math.random() * 10000);
        uniqueName = `${baseName}${randomNum}`;
        
        const existedUserName = await this.userRepository.findByUserName(uniqueName);
        if (!existedUserName && retryCount < maxRetries) {
          isAvailable = true;
        }else{
            retryCount++
        }
      }

      if (!isAvailable) {
        throw new Error("Failed to generate a unique username after maximum retries.");
      }
      
      return uniqueName;
    }
}