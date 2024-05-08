// libraries
import multer from "multer";
import path from "node:path";

const multerUpload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 megabytes
});

export default multerUpload;
