import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = path.join("JobConnectX", "BackEnd", "Public");

// ✅ Ensure directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("📂 File destination set to:", uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    console.log("📄 Filename being set:", file.originalname);
    cb(null, file.originalname);
  }
});

export const upload = multer({
  storage,
  // limits: { fileSize: 1024 * 1024 * 5 }  // Optional: 5MB size limit
});
