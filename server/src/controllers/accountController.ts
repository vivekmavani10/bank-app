import { Request, Response } from "express";
import { AccountModel } from "../models/accountModels";
import { dbPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const accountModel = new AccountModel(dbPool);

// Create Account
export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      account_type,
      balance,
      aadhar_number,
      pan_number,
      nominee_name,
      nominee_relationship,
      address,
    } = req.body;

    const user_id = (req as any).user?.user_id;

    const aadhar_file = (req.files as any)?.aadhar_file?.[0]?.path;
    const pan_file = (req.files as any)?.pan_file?.[0]?.path;

    // Validate required fields
    if (
      !account_type ||
      !balance ||
      !aadhar_number ||
      !aadhar_file ||
      !pan_number ||
      !pan_file ||
      !nominee_name ||
      !nominee_relationship ||
      !address
    ) {
      res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
      return;
    }

    if (aadhar_number.length !== 12 || !/^\d+$/.test(aadhar_number)) {
      res
        .status(400)
        .json({
          status: "error",
          message: "Aadhaar number must be exactly 12 digits",
        });
      return;
    }

    const existingAccount = await accountModel.findAccountByUserId(user_id);

    if (existingAccount) {
      res
        .status(409)
        .json({
          status: "error",
          message: "You already have an account in this bank",
        });
      return;
    }

    const account_number = accountModel.generateAccountNumber();
    const account_uuid = uuidv4();

    await accountModel.createAccount({
      account_uuid,
      account_number,
      user_id,
      account_type,
      balance,
      nominee_name,
      nominee_relationship,
    });

    await accountModel.createKyc({
      user_id,
      aadhar_number,
      aadhar_file,
      pan_number,
      pan_file,
    });

    await accountModel.updateAddress(user_id, address);

    res.status(201).json({
      status: "success",
      message: "Account application submitted successfully",
      account_uuid,
    });
  } catch (error) {
    console.error("Error creating account:", error);
    res
      .status(500)
      .json({
        status: "error",
        message: "Failed to submit account application",
      });
  }
};

// Get Logged-in User's Account Details
export const getAccountDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;

    if (!user_id) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: User not logged in" });
      return;
    }

    const [rows]: any = await accountModel.getAccountDetails(user_id);

    if (!rows || rows.length === 0) {
      res.status(404).json({
        status: "error",
        message: "You don't have an account yet. Please apply for one.",
      });
      return;
    }
    const accountDetails = await accountModel.getAccountDetailsByUserId(
      user_id
    );

    res.status(200).json({
      status: "success",
      message: "Account details fetched successfully",
      data: accountDetails,
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch account details" });
  }
};
