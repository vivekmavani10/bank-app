// controllers/adminAccountController.ts
import { Request, Response } from "express";
import { dbPool } from "../config/db";
import { AdminAccountModel } from "../models/adminAccountModel";

const adminAccountModel = new AdminAccountModel(dbPool);

export const getAllUserAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await adminAccountModel.getAllUserAccounts();
    res.status(200).json({ accounts });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const approveAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(account_uuid, "approved");

    if (success) {
      res.status(200).json({ message: "Account approved successfully" });
    } else {
      res.status(400).json({ message: "Account status is already approved or invalid UUID" });
    }
  } catch (error) {
    console.error("Error approving account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT: Reject account
export const rejectAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(account_uuid, "rejected");

    if (success) {
      res.status(200).json({ message: "Account rejected successfully" });
    } else {
      res.status(400).json({ message: "Account status is already rejected or invalid UUID" });
    }
  } catch (error) {
    console.error("Error rejecting account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
