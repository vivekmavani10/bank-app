import { Request, Response } from "express";
import { dbPool } from "../config/db";
import { AdminAccountModel } from "../models/adminAccountModel";

const adminAccountModel = new AdminAccountModel(dbPool);

export const getAllUserAccounts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string | undefined;

    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    const safePage = !isNaN(page) && page > 0 ? page : 1;
    const safeLimit = !isNaN(limit) && limit > 0 ? limit : 10;
    const offset = (safePage - 1) * safeLimit;

    const accounts = await adminAccountModel.getAllUserAccounts(
      search,
      safeLimit,
      offset
    );
    const totalCount = await adminAccountModel.getTotalUserAccountsCount(
      search
    );

    res.status(200).json({
      status: "success",
      message: "User accounts fetched successfully",
      data: accounts,
      pagination: {
        total: totalCount,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(totalCount / safeLimit),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch user accounts",
    });
  }
};

export const approveAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(
      account_uuid,
      "approved"
    );

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

export const rejectAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { account_uuid } = req.params;

    const success = await adminAccountModel.updateAccountStatus(
      account_uuid,
      "rejected"
    );

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
