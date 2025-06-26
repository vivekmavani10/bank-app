import express from "express";
import {
  createAccount,
  getAccountDetails,
} from "../controllers/accountController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { uploadAccountFiles } from "../middlewares/uploadsMiddleware";

const accountRouter = express.Router();

accountRouter.post(
  "/account",
  authenticateToken,
  uploadAccountFiles,
  createAccount
);

// Get logged in user's account details routes
accountRouter.get("/account", authenticateToken, getAccountDetails);

export default accountRouter;
