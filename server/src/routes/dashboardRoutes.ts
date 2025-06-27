import express from "express";
import { adminCheck } from "../middlewares/admincheckMiddleware";
import { getDashboard } from "../controllers/dashboardController";

const dashboardRouter = express.Router();

dashboardRouter.get("/admin-dashboard", adminCheck, getDashboard);

export default dashboardRouter;
