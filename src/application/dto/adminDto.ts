import { Admin } from "../../domain/entities/admin";

export interface adminResponse{
    admin:Admin,
    tokens:{
        accessToken:string
    }
}