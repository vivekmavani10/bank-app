import { Request, Response } from "express";
import { QueryModel } from "../models/queryModels";
import { dbPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const queryModel = new QueryModel(dbPool);

export const submitQuery = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;
    const { query } = req.body;

    if (!query) {
      res.status(400).json({
        status: "error",
        message: "Enter query!",
      });
    }

    const query_uuid = uuidv4();

    await queryModel.submitQuery({
      query_uuid,
      user_id,
      query,
    });

    res.status(200).json({
      status: "success",
      message: "Query Submitted successfully",
      query_uuid,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Query Submit failed" });
  }
};

export const editQuery = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query_uuid } = req.params;
    const { query } = req.body;

    if (!query_uuid) {
      res.status(400).json({
        status: "error",
        message: "Query not found!",
      });
    }

    if (!query) {
      res.status(400).json({
        status: "error",
        message: "Enter query!",
      });
    }

    const user_id = (req as any).user?.user_id;

    await queryModel.editQuery({
      query_uuid,
      query,
      user_id,
    });

    res.status(200).json({
      status: "success",
      message: "Query updated successfully.",
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Query edit failed" });
  }
};

export const deleteQuery = async (req: Request, res: Response): Promise<void> => {
    try {
        const { query_uuid } = req.params;
    
        if (!query_uuid) {
        res.status(400).json({
            status: "error",
            message: "Query not found!",
        });
        }
    
        await queryModel.deleteQuery(query_uuid);
    
        res.status(200).json({
        status: "success",
        message: "Query deleted successfully.",
        });
    } catch (err) {
        res.status(500).json({ status: "error", message: "Query delete failed" });
    }
}
export const getUserQueries = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;

    if (!user_id) {
      res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
      return;
    }

    const queries = await queryModel.getUserQueries(user_id);

    res.status(200).json({
      status: "success",
      data: queries,
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: "Failed to fetch queries" });
  }
};
