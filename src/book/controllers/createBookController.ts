// libraries
import { NextFunction, Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";
import fs from "node:fs";

// utilities
import logMessage from "../../utils/logMessage";

// models
import bookModel from "../bookModel";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre } = req.body;

  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };

    // ************** uploading book cover image **************
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

    // ************** uploading book pdf file **************
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

    // ************** store book in db **************
    const newBook = await bookModel.create({
      bookTitle: title,
      bookAuthor: "663b3ce75fd3d97cc4ef20c6",
      bookGenre: genre,
      bookCoverImage: bookCoverUploadResponse.secure_url,
      bookFile: bookPdfUploadResponse.secure_url,
    });

    // ************** delete files stored locally **************
    await fs.promises.unlink(bookCoverImagePath);
    await fs.promises.unlink(bookPdfFilePath);

    res.json({
      message: "Books details and files uploaded successfully",
      bookId: newBook._id,
      bookTitle: newBook.bookTitle,
    });
  } catch (error) {
    console.error("Error uploading file: ", error);
    const customError = createHttpError(500, "Failed to upload image, pls try again");
    return next(customError);
  }
};
