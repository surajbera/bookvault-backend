// libraries
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

// configurations
import { config } from "../config/config";

// types
import { IUser } from "./userTypes";

// user schema
import userModel from "./userModel";

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    const customError = createHttpError(400, "All fields are required");
    return next(customError);
  }

  try {
    // Database call
    const user = await userModel.findOne({ email: email });
    if (user) {
      const customError = createHttpError(409, "User already exists with this email");
      return next(customError);
    }
  } catch (error) {
    const customError = createHttpError(500, "Failed to check existing user");
    return next(customError);
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
    const customError = createHttpError(500, "Failed to create user account");
    return next(customError);
  }

  // Token Generation
  try {
    const payload = { sub: newUser._id.toString() };
    const secret = config.jwtSecret;
    const options = { expiresIn: "7d" };
    const token = sign(payload, secret as string, options); // synchronous function, no need to add await

    // Response
    res.status(201).json({ message: "New user registered", accessToken: token });
  } catch (error) {
    const customError = createHttpError(500, "Failed to generate authentication token");
    return next(customError);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  console.log("email => ", email);

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // check user email
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return next(createHttpError(400, "Email address not found"));
    }

    // check user password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(400, "Invalid email or password"));
    }

    // create access token
    const payload = { sub: user._id.toString() };
    const secret = config.jwtSecret;
    const options = { expiresIn: "7d" };

    const token = sign(payload, secret as string, options);

    res.status(200).json({ message: "Successfully logged in", accessToken: token });
  } catch (err) {
    return next(createHttpError(500, "Unexpected error during login process"));
  }
};

export { registerUser, loginUser };
