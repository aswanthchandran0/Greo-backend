import { Types } from 'mongoose';

// Entity for representing Saved Items (for passing data)
export interface SavedItemEntity {
  userId: Types.ObjectId;
  items: Array<{
    itemId: Types.ObjectId;
    type: 'post' | 'reel';  // Type of the saved item (post or reel)
    collectionName?: string;  // Optional collection name
  }>;
}

// Entity for individual items in the saved collection
export interface SavedItemArrayElement {
  itemId: Types.ObjectId;
  type: 'post' | 'roll';  
  collectionName?: string;
}  
    