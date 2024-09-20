import { Admin } from "../../domain/entities/admin";
import { AdminRepository } from "../../domain/repositories/adminRepository";
import { AdminModel } from "../database/mongo/models/adminModel";

export class AdminRepositoryImpl implements AdminRepository{
     async findByEmail(email: string): Promise<Admin | null> {
         const adminModel = await AdminModel.findOne({email}).exec()
         return adminModel?
           new Admin(adminModel.id,adminModel.admin_name,adminModel.email,adminModel.password):null
     }
     async save(admin:Admin):Promise<void>{
     const adminModel = new AdminModel(admin)
     await adminModel.save()
     }
}