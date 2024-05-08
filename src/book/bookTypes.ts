import { IUser } from "../user/userTypes";

export interface IBook {
  id: string;
  bookTitle: string;
  bookAuthor: IUser;
  bookGenre: string;
  bookCoverImage: string; // cloudinary image url
  bookFile: string;
  createdAt: Date; // todo: remove if not needed
  updatedAt: Date; // todo: remove if not needed
}
