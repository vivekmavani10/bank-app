import express from "express";
import { createAccount } from "../controllers/accountController";
import { authenticateToken } from "../middlewares/authMiddleware";

const accountRouter = express.Router();

accountRouter.post("/account", authenticateToken, createAccount);

export default accountRouter;
