import { Request, Response } from "express";
import { dbPool } from "../config/db";
import { AdminAccountModel } from "../models/adminAccountModel";

const adminAccountModel = new AdminAccountModel(dbPool);

export const getAllUserAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await adminAccountModel.getAllUserAccounts();
    res.status(200).json({
      status: "success",
      message: "User accounts fetched successfully",
      data: accounts,
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user accounts",
    });
  }
};

export const approveAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(account_uuid, "approved");

    if (success) {
      res.status(200).json({
        status: "success",
        message: "Account approved successfully",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Account is already approved or the UUID is invalid",
      });
    }
  } catch (error) {
    console.error("Error approving account:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while approving account",
    });
  }
};

export const rejectAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(account_uuid, "rejected");

    if (success) {
      res.status(200).json({
        status: "success",
        message: "Account rejected successfully",
      });
    } else {
      res.status(400).json({
        status: "error",
        message: "Account is already rejected or the UUID is invalid",
      });
    }
  } catch (error) {
    console.error("Error rejecting account:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error while rejecting account",
    });
  }
};
