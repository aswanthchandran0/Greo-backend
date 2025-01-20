import { Request, Response } from "express";
import { AdminService } from "../../application/services/adminService";
import { User } from "../../domain/entities/user";
import mongoose, { Mongoose, Types } from "mongoose";

export class AdminController {
  constructor(private adminservice: AdminService) {}
  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const response = await this.adminservice.signin(email, password);
      console.log("response", response);
      res.status(200).json({
        admin: {
          id: response.admin._id,
          admin_name: response.admin.admin_name,
          email: response.admin.email,
        },
        token: response.tokens,
      });
    } catch (err) {
      console.log(err);

      const errorMessage = (err as Error).message || "An error occured";
      res.status(400).json({ error: errorMessage });
    }
  }

  async getAllUser(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.adminservice.getAllUser();
      console.log("users in admin controller", users);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err as Error }.message);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.user_id;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      console.log("user id", userObjectId);
      const user = await this.adminservice.getUserById(userObjectId);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: User = req.body;
      await this.adminservice.updateUser(userData);

      res.status(200).json({ message: "User Updated Sucessfully" });
    } catch (err) {
      res.status(500).json({ Message: (err as Error).message });
    }
  }

  async suspendUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      console.log("user id", userId);
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await this.adminservice.suspendUser(userObjectId);
      res.status(200).json({ message: "User suspended sucessfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: (err as Error).message });
    }
  }

  async unSuspendUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.userId;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await this.adminservice.unSuspendUser(userObjectId);
      res.status(200).json({ message: "User unsuspended sucessfully" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const response = await this.adminservice.GetUserDetailsService(
        userObjectId
      );
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async getReportedPost(req: Request, res: Response): Promise<void> {
    try {
      const response = await this.adminservice.GetReportedPosts();
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async getStackOfUser(req:Request,res:Response):Promise<void>{
    try{
       const {userIds} = req.body

       const ObjectUserId = userIds.map((userId:string) => new mongoose.Types.ObjectId(userId))
       const response = await this.adminservice.FindStackOfUser(ObjectUserId)
       res.status(200).json(response);
    }catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async GetTop10Users(req:Request,res:Response):Promise<void>{
    try{
      const response = await this.adminservice.GetTop10Users()
      res.status(200).json(response)
    }catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }
  }

  async FetchAllPostsAndRolls(req:Request,res:Response):Promise<void>{
    try{
    const response = await this.adminservice.getPostsAndRoll()
    console.log("response",response)
    res.status(200).json(response)
    }catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }

  }

  async BlockUserPost(req:Request,res:Response):Promise<void>{
    try{
    const {postId,action} = req.body
    console.log("postid",postId)
    console.log("action",action)
     const response = await this.adminservice.blockUserPost(new Types.ObjectId(postId),action)
     console.log("response ",response)
     res.status(200).json(response)
    }catch (err) {
      console.log(err);
      res.status(400).json({ message: (err as Error).message });
    }

  }
}
