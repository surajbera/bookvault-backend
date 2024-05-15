// libraries
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../bookModel";
import { AuthRequest } from "../../middlewares/authMiddleware";
import cloudinary from "../../config/cloudinary";

export const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    // Validate bookId (example: check if it's a valid MongoDB ObjectId)
    if (!bookId || !bookId.match(/^[0-9a-fA-F]{24}$/)) {
      return next(createHttpError(400, "Invalid book ID format"));
    }

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const _req = req as AuthRequest;
    if (book.bookAuthor.toString() !== _req.userId) {
      return next(createHttpError(401, "Unauthorized access"));
    }

    if (book.bookCoverImage) {
      const coverImagePublicId = getPublicIdFromUrl(book.bookCoverImage);
      await cloudinary.uploader.destroy(coverImagePublicId);
    }

    if (book.bookFile) {
      const bookFilePublicId = getPublicIdFromUrl(book.bookFile);
      await cloudinary.uploader.destroy(bookFilePublicId, { resource_type: "raw" });
    }

    // Delete the book document from MongoDB
    await bookModel.deleteOne({ _id: bookId });

    res.status(200).send({ message: "Book deleted successfully." });
  } catch (error) {
    console.error("Error deleting book:", error);
    return next(createHttpError(500, "Error while deleting the book"));
  }
};

// Helper function to extract the public ID from a Cloudinary URL
function getPublicIdFromUrl(url: string): string {
  const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
  return matches ? matches[1] : "";
}
