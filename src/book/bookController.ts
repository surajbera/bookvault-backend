import { NextFunction, Request, Response } from 'express';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'Create Book Route' });
};
