import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt';
import { config } from '../config/config';
import { sign } from 'jsonwebtoken';
import { IUser } from './userTypes';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const customError = createHttpError(400, 'All fields are required');
    return next(customError);
  }

  try {
    // Database call
    const user = await userModel.findOne({ email: email });
    if (user) {
      const customError = createHttpError(400, 'User already exists with this email');
      return next(customError);
    }
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user'));
  }

  // password hashing
  const saltRounds = Number(config.saltRounds) || 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  let newUser: IUser;
  try {
    // Storing the user in database
    newUser = await userModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user'));
  }

  // Token Generation
  try {
    const payload = { sub: newUser._id.toString() };
    const secret = config.jwtSecret;
    const options = { expiresIn: '7d' };
    const token = sign(payload, secret as string, options); // synchronous function, no need to add await

    // Response
    res.json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, 'Error while signing the JWT token'));
  }
};

export { createUser };
