import express from "express";
import { updatePasswordByAdmin } from "../controllers/ForgotPasswordController";
import { adminCheck } from "../middlewares/admincheckMiddleware";

const router = express.Router();

router.put("/updatePasswordByAdmin", adminCheck, updatePasswordByAdmin);

export default router;
