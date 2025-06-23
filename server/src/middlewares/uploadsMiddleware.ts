import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Ensure upload folders exist
const ensureFolderExists = (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// Set up storage logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads";

    if (file.fieldname === "aadhar_file") {
      uploadPath = path.join("uploads", "aadhar");
    } else if (file.fieldname === "pan_file") {
      uploadPath = path.join("uploads", "pan");
    }

    ensureFolderExists(uploadPath);
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = uuidv4() + ext;
    cb(null, uniqueName);
  },
});

// Multer instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Optional: 5MB limit
  },
});

// Middleware for account file uploads
export const uploadAccountFiles = upload.fields([
  { name: "aadhar_file", maxCount: 1 },
  { name: "pan_file", maxCount: 1 },
]);
