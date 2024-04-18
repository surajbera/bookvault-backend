import mongoose from 'mongoose';
import { User } from './userTypes';

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
  // created_at, updated_at
);

export default mongoose.model<User>('User', userSchema);
