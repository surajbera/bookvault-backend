// libraries
import mongoose from 'mongoose';

// types
import { IUser } from './userTypes';

const userSchema = new mongoose.Schema<IUser>(
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

export default mongoose.model<IUser>('User', userSchema);
