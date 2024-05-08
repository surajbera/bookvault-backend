import mongoose from "mongoose";
import { IBook } from "./bookTypes";

const bookSchema = new mongoose.Schema<IBook>(
  {
    bookTitle: {
      type: String,
      required: true,
    },
    bookAuthor: {
      type: mongoose.Schema.Types.ObjectId, // Reference to another document, typically an Author's ID
      required: true,
    },
    bookGenre: {
      type: String,
      required: true,
    },
    bookCoverImage: {
      type: String,
      required: true,
    },
    bookFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", bookSchema);
