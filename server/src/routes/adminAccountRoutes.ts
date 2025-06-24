import express from "express";
import { getAllUserAccounts,approveAccount,rejectAccount  } from "../controllers/adminAccountController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { adminCheck } from "../middlewares/admincheckMiddleware";

const router = express.Router();

router.get("/accounts", authenticateToken, adminCheck, getAllUserAccounts);
router.put("/account/approve/:account_uuid", authenticateToken, adminCheck, approveAccount);
router.put("/account/reject/:account_uuid", authenticateToken, adminCheck, rejectAccount);

export default router;
