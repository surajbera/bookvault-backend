import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import userModel from './userModel';
import bcrypt from 'bcrypt';
import { config } from '../config/config';
import { sign } from 'jsonwebtoken';
import { IUser } from './userTypes';

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
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
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, 'Error while getting user'));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log('email => ', email);

  if (!email || !password) {
    return next(createHttpError(400, 'All field are required'));
  }

  try {
    // check user email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(createHttpError(400, 'Email or password is wrong'));
    }

    // check user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, 'Password is incorrect'));
    }

    // create access token
    const payload = { sub: user._id.toString() };
    const secret = config.jwtSecret;
    const options = { expiresIn: '7d' };

    const token = sign(payload, secret as string, options);

    res.json({ accessToken: token });
  } catch (err) {
    return next(createHttpError(400, 'Error while logging in the user'));
  }
};

export { registerUser, loginUser };
