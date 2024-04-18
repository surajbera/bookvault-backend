import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const customError = createHttpError(400, 'All fields are required');
    return next(customError);
  }

  // Process

  // Response
  res.json({ message: 'User Created' });
};

export { createUser };
