import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { submitQuery, editQuery, deleteQuery,getUserQueries  } from "../controllers/queryController";

const queryRouter = express.Router();

queryRouter.post("/query", authenticateToken, submitQuery);
queryRouter.put("/query/:query_uuid", authenticateToken, editQuery);
queryRouter.delete("/query/:query_uuid", authenticateToken, deleteQuery);
queryRouter.get("/query", authenticateToken, getUserQueries);

export default queryRouter;