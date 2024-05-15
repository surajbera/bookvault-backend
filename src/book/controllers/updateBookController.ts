import { Request, Response, NextFunction } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs";
import bookModel from "../bookModel";
import { AuthRequest } from "../../middlewares/authMiddleware";

export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;
  const bookId = req.params.bookId;

  const book = await bookModel.findOne({ _id: bookId });

  if (!book) {
    return next(createHttpError(404, "Specified book not found!!"));
  }

  const _req = req as AuthRequest;
  if (book.bookAuthor.toString() !== _req.userId) {
    return next(createHttpError(401, "Unauthorized access"));
  }

  const files = req.files as { [fieldName: string]: Express.Multer.File[] };

  let updatedBookCoverImage = "";
  if (files.coverImage) {
    const bookCoverImageName = files.coverImage[0].filename;
    const bookCoverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const bookCoverImagePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      bookCoverImageName
    );

    const bookCoverUploadResponse = await cloudinary.uploader.upload(bookCoverImagePath, {
      folder: "book-vault/book-covers",
      format: bookCoverImageMimeType,
      filename_override: bookCoverImageName,
    });

    updatedBookCoverImage = bookCoverUploadResponse.secure_url;
    await fs.promises.unlink(bookCoverImagePath);
  }

  let updatedBookPdfFileName = "";
  if (files.file) {
    const bookPdfFileName = files.file[0].filename;
    const bookPdfFileMimeType = files.file[0].mimetype.split("/").at(-1);
    const bookPdfFilePath = path.resolve(
      __dirname,
      "../../../public/data/uploads",
      bookPdfFileName
    );

    const bookPdfUploadResponse = await cloudinary.uploader.upload(bookPdfFilePath, {
      resource_type: "raw",
      folder: "book-vault/book-pdfs",
      format: bookPdfFileMimeType,
      filename_override: bookPdfFileName,
    });

    updatedBookPdfFileName = bookPdfUploadResponse.secure_url;
    await fs.promises.unlink(bookPdfFilePath);
  }

  const updatedBook = await bookModel.findOneAndUpdate(
    {
      _id: bookId,
    },
    {
      bookTitle: title,
      bookGenre: genre,
      bookCoverImage: updatedBookCoverImage ? updatedBookCoverImage : book.bookCoverImage,
      bookFile: updatedBookPdfFileName ? updatedBookPdfFileName : book.bookFile,
    },
    { new: true }
  );

  res.json(updatedBook);
};
