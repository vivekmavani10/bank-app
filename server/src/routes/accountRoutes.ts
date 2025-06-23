import express from "express";
import { createAccount } from "../controllers/accountController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadAccountFiles } from "../middlewares/uploadsMiddleware"

const accountRouter = express.Router();

accountRouter.post(
  "/account",
  authenticateToken,
  uploadAccountFiles,
  createAccount
);

export default accountRouter;
