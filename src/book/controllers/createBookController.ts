// libraries
import { NextFunction, Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

// utilities
import logMessage from "../../utils/logMessage";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  logMessage("req.files", req.files);

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

    await cloudinary.uploader.upload(bookCoverImagePath, {
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

    await cloudinary.uploader.upload(bookPdfFilePath, {
      resource_type: "raw",
      folder: "book-vault/book-pdfs",
      format: bookPdfFileMimeType,
      filename_override: bookPdfFileName,
    });

    res.json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Error uploading file: ", error);
    const customError = createHttpError(500, "Failed to upload image, pls try again");
    return next(customError);
  }
};
