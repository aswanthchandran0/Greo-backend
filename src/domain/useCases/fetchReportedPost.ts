import { IpostReport } from "../../infrastructure/database/mongo/models/postReportModel";
import { PostRepository } from "../repositories/postRepository";

export class FetchReportedPosts {
  constructor(private postRepository: PostRepository) {}

  async execute(): Promise<IpostReport[] | null> {
    return await this.postRepository.getReportedPosts();
  }
}
