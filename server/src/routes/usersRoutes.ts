import express from "express";
import { register, login } from "../controllers/usersController";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
