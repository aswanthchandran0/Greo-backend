import { PostDto } from "./postDto";
import { RollDto } from "./rollDto";


// DTO for Saved Post, including both Post and Roll (Reel)
export interface SavedItemDto {
  userId: string;  // ID of the user who saved the post
  items: Array<{
    itemId: string;  // Item ID (either Post or Reel)
    type: 'post' | 'roll';  // Type to distinguish between post and reel
    collectionName?: string;  // Optional collection name for categorizing saved items
    postData?: PostDto;  // Post data if the item is a post
    rollData?: RollDto;  // Roll data if the item is a reel
  }>;
}
