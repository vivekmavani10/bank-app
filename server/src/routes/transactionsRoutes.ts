import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  transferMoney,
  depositMoney,
  getTransactionHistory,
} from "../controllers/transactionsController";
import { adminCheck } from "../middlewares/admincheckMiddleware";

const transactionRouter = express.Router();

transactionRouter.post("/transfer", authenticateToken, transferMoney);

transactionRouter.post("/deposit", authenticateToken, adminCheck, depositMoney);

transactionRouter.get(
  "/transactions",
  authenticateToken,
  getTransactionHistory
);

export default transactionRouter;
