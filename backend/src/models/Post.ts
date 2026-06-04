import { Schema, model, Document, Types } from 'mongoose';

interface ILike {
  userId: Types.ObjectId;
  username: string;
}

interface IComment {
  userId: Types.ObjectId;
  username: string;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  user: Types.ObjectId;
  username: string;
  textContent?: string;
  imageUrl?: string;
  likes: ILike[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  textContent: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  likes: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true }
    }
  ],
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      username: { type: String, required: true },
      text: { type: String, required: [true, 'Comment content cannot be empty'] },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

export default model<IPost>('Post', postSchema);
