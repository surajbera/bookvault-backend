// libraries
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../bookModel";

export const getSingleBookController = async (req: Request, res: Response, next: NextFunction) => {
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

    return res.json(book);
  } catch (error) {
    console.error("Failed to fetch book:", error);
    return next(createHttpError(500, "Error while fetching the book"));
  }
};
