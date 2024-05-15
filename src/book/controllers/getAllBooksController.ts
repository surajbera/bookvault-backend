// libraries
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bookModel from "../bookModel";

export const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await bookModel.find();

    res.json(book);
  } catch (error) {
    return next(createHttpError(500, "Error while getting the book"));
  }
};
