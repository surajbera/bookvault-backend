import { IUser } from '../user/userTypes';

export interface IBook {
  id: string;
  title: string;
  author: IUser;
  genre: string;
  coverImage: string; // cloudinary image url
  file: string;
  createdAt: Date; // todo: remove if not needed
  updatedAt: Date; // todo: remove if not needed
}
