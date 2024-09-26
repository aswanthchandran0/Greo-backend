import { AdminRepository } from "../repositories/adminRepository";
import { Admin } from "../entities/admin";
import tokenService from "../../application/services/tokenService";
import bcrypt from 'bcrypt'
import { adminResponse } from "../../application/dto/adminDto";
export class SigninAdmin{
    constructor (private adminRepository:AdminRepository){}
    async execute(email:string,password:string):Promise<adminResponse>{
      const admin = await this.adminRepository.findByEmail(email)

        if(!admin){
            throw new Error('Admin not found')
        }
        const isPasswordValid = await bcrypt.compare(password,admin['password'])
        if(!isPasswordValid){
            throw new Error('Invalid credentials')
        }
        console.log('admin',admin)
        const adminAccessToken = tokenService.generateAdminAccessToken(admin._id);
        return {admin,
            tokens:{
                accessToken: adminAccessToken,
            }
        }
    }
}