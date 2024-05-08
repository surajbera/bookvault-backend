import { NextFunction, Request, Response } from "express";
import cloudinary from "../../config/cloudinary";
import path from "node:path";
import logMessage from "../../utils/logMessage";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  logMessage("req.files", req.files);

  try {
    // uploading book cover image
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const fileName = files.coverImage[0].filename;
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filePath = path.resolve(__dirname, "../../public/data/uploads", fileName);

    logMessage("fileName", fileName);
    logMessage("coverImageMimeType", coverImageMimeType);
    logMessage("filePath", filePath);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: "book-vault/book-covers",
      format: coverImageMimeType,
      filename_override: fileName,
    });

    console.log("uploadResult => ", uploadResult);

    res.json({ message: "Create Book Route" });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ error: "Failed to upload image, pls try again" });
  }
};
