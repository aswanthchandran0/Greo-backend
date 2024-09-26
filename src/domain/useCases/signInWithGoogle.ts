import { userRepository } from "../repositories/userRepository";
import GoogleOAuthService from "../../application/services/googleOAuthService";
import tokenService from "../../application/services/tokenService";
import { GoogleSignInResponse } from "../../application/dto/userDto";

export class SignInWithGoogle {
  private googleOAuthService: GoogleOAuthService;
  constructor(
    private userRepository: userRepository,
  ) {
    this.googleOAuthService = new GoogleOAuthService()
  }
  async execute(token: string): Promise<GoogleSignInResponse> {
    const decodedtoken = await this.googleOAuthService.verifyGoogleToken(token);
    if (!decodedtoken) {
      throw new Error('Invalid Google token')
    }
    const email = decodedtoken.email
    let user = await this.userRepository.findByEmail(email)
    if (!user) throw new Error('User not exist')
    if (user.is_suspended) throw new Error('User suspended')
    const accessToken = tokenService.generateAccessToken(user.id);
    const refreshToken = tokenService.generateRefreshToken(user.id);

    return {
      user: {
        id: user.id,
        profileImage: user.profileImage,
        name: user.name,
        user_name: user.user_name,
        email: user.email,
        user_bio: user.user_bio,
        lastseen_online: user.lastseen_online,
        is_suspended: user.is_suspended
      },
      tokens: {
        accessToken,
        refreshToken
      }
    };
  }
}