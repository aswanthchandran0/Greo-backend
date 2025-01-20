import { CloudinaryService } from "../../application/services/cloudnaryService";
import { User } from "../entities/user";
import { userRepository } from "../repositories/userRepository";
import { UserGraphService } from "../../application/services/userGraphService";

export class UpdateProfile {
  constructor(
    private userRepository: userRepository,
    private cloudinaryService: CloudinaryService,
    private userGraphService: UserGraphService
  ) {}
  async execute(userData: Partial<User>): Promise<User | null> {
    if (userData.id === undefined) throw new Error("user id is required");
    const user = await this.userRepository.findByUserId(userData.id);
    if (!user) throw new Error("user not found");
    const forUpdate = Object.fromEntries(
      Object.entries(userData).filter(([key, value]) => value)
    );

    console.log('forupdate',forUpdate)
    if (forUpdate.user_name) {
        console.log('request was reaching in this condition')
      await this.userGraphService.updateUserName(
        userData.id.toString(),
        forUpdate.user_name.toString()
      );
    }
    if (forUpdate.profileImage) {
      let profileImageUrl = await this.cloudinaryService.uploadToCloudinary(
        [forUpdate.profileImage as string],
        "profile"
      );
      forUpdate.profileImage = profileImageUrl[0]
        ? profileImageUrl[0].secure_url
        : null;
    }
    return await this.userRepository.updateUser(user.id, forUpdate);
  }
}
