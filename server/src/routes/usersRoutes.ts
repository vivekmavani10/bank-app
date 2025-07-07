import express from "express";
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
} from "../controllers/usersController";
import { authenticateToken } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authenticateToken, getUserProfile);
authRouter.put("/profile", authenticateToken, updateUserProfile);

export default authRouter;
