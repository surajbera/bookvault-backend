// libraries
import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';

// configurations
import { config } from '../config/config';

const globalErrorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === 'development' ? err.stack || 'No stack trace available' : '',
  });
};

export default globalErrorHandler;
