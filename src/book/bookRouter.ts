// libraries
import express from "express";

// middlewares
import multerUpload from "../middlewares/uploadMiddleware";

// controllers
import { createBook } from "./controllers/createBookController";

const bookRouter = express.Router();

// routes
bookRouter.post(
  "/",
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
