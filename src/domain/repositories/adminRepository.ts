import { Admin } from "../entities/admin";
import { Schema } from "mongoose";
export interface AdminRepository{
     findByEmail(email:string):Promise<Admin|null>
     save(admin:Admin):Promise<void>;
}