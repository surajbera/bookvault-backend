import express, { Request, Response, NextFunction } from 'express';
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';

const app = express();

app.get('/', (req, res, next) => {
  // throw new Error('Something went wrong');
  // instead of throwing an error like above
  // making use of the createHttpError() method
  // from the http-errors library

  const customError = createHttpError(400, 'Something went wrong');
  throw customError;
  res.json({ message: 'Welcome to elib apis' });
});

// Global error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message,
    errorStack: config.env === 'development' ? err.stack : '',
  });
  // make sure to update NODE_ENV to production
});

export default app;
