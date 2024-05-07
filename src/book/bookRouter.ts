// libraries
import express from "express";
import multer from "multer";

// controllers
import { createBook } from "./bookController";

import path from "node:path";

const bookRouter = express.Router();

const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 megabytes
});

// routes
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
