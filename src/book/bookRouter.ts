// libraries
import express from "express";

// middlewares
import multerUpload from "../middlewares/uploadMiddleware";

// controllers
import { createBook } from "./controllers/createBookController";
import authenticate from "../middlewares/authMiddleware";
import { updateBook } from "./controllers/updateBookController";
import { getAllBooks } from "./controllers/getAllBooksController";
import { getSingleBookController } from "./controllers/getSingleBookController";

const bookRouter = express.Router();

// routes
bookRouter.post(
  "/",
  authenticate,
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  multerUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

bookRouter.get("/", getAllBooks);

bookRouter.get("/:bookId", getSingleBookController);

export default bookRouter;
