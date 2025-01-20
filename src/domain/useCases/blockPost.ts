import { Types } from "mongoose";
import { PostRepository } from "../repositories/postRepository";
import { EmailService } from "../../application/services/emailService";

export class BlockPost {
  constructor(
    private postRepository: PostRepository,
    private emailService: EmailService
  ) {}

  async execute(postId: Types.ObjectId, action: boolean): Promise<boolean> {
    const response = await this.postRepository.blockAndUnblockPost(
      postId,
      action
    );
    const postDetails = await this.postRepository.getUserPostByPostId(postId);
    const email = postDetails?.email ?? '';
    const subject = `Your Post Has Been ${action? 'Blocked':'Unblocked'}`;
    let message = "";
    if (postDetails) {
      message = `
         Dear ${postDetails.name},

We hope this message finds you well.

This is to inform you that your post has been ${
  action ? "blocked" : "unblocked"
} by our admin team. 

${
  action
    ? "This action was taken due to violations of our community guidelines."
    : "We have reviewed your post and determined that it no longer violates our community guidelines, so it has been unblocked."
}

Below are the details of your post:

Post Content: ${postDetails.content || "No content"}
Post Image: ${postDetails.mediaUrls[0] || "No image available"}

If you believe this decision was made in error, or if you would like to appeal this action, please contact us at aswanthc26@gmail.com, and we will review your case.

Thank you for understanding.

Best regards,  
Greo Team

          `;
    }
      await this.emailService.sendAdminMail(email,subject,message)
    return response;
  }
}
