import express from "express";
import { register } from "../controller/usersController";

const authRouter = express.Router();

authRouter.post("/register", register);

export default authRouter;
