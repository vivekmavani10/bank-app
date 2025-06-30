import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import {
  transferMoney,
  depositMoney,
  getTransactionHistory,
  downloadTransactionStatementPDF
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

transactionRouter.get("/statement", authenticateToken, downloadTransactionStatementPDF);

export default transactionRouter;
