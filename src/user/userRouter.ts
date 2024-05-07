// libraries
import express from 'express';

// controllers
import { registerUser, loginUser } from './userController';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

export default userRouter;
