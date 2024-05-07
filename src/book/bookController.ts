import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files =>", req.files);

  try {
    const files = req.files as { [fieldName: string]: Express.Multer.File[] };
    const fileName = files.coverImage[0].filename;
    const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
    const filePath = path.resolve(__dirname, "../../public/data/uploads", fileName);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    console.log("uploadResult => ", uploadResult);

    res.json({ message: "Create Book Route" });
  } catch (error) {
    console.error("Error uploading file: ", error);
    res.status(500).json({ error: "Failed to upload image, pls try again" });
  }
};
