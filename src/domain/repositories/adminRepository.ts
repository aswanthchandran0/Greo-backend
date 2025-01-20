import { UserDetails } from "../../application/dto/userDto";
import { Admin } from "../entities/admin";
import mongoose, { Schema } from "mongoose";
export interface AdminRepository{
     findByEmail(email:string):Promise<Admin|null>
     save(admin:Admin):Promise<void>;
}