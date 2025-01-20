import mongoose, { Schema, Document, Types } from 'mongoose';

// Define the SavedItem schema 
export interface ISavedItem extends Document {
  userId: Types.ObjectId;
  items: Array<{
    itemId: Types.ObjectId;
    type: 'post' | 'roll';  // The type of the saved item, either 'post' or 'reel'
    collectionName?: string;  // Optional collection name
  }>;
}

const savedItemSchema: Schema = new Schema<ISavedItem>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming there's a User model
    required: true,
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'items.type',  // This allows dynamic population based on the 'type' field
      },
      type: {
        type: String,
        enum: ['post', 'roll'],  // Enum to restrict the type to 'post' or 'reel'
        required: true,
      },
      collectionName: {
        type: String,
        required: false,  // Optional collection name
      },
    },
  ],
});

// Create the SavedItem model
const SavedItemModel = mongoose.model<ISavedItem>('SavedItem', savedItemSchema);

export default SavedItemModel;
