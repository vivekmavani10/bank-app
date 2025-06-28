import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { transferMoney } from "../controllers/transactionsController";

const transactionRouter = express.Router();

transactionRouter.post("/transfer", authenticateToken, transferMoney);

export default transactionRouter;
