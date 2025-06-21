import { Request, Response } from "express";
import { AccountModel } from "../models/accountModels";
import { dbPool } from "../config/db";

const accountModel = new AccountModel(dbPool);

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      account_type,
      balance,
      aadhar_number,
      aadhar_file,
      pan_number,
      pan_file,
      nominee_name,
      nominee_relationship,
      address,
    } = req.body;

    const user_id = (req as any).user?.user_id;

    if (
      !account_type ||
      !balance ||
      !aadhar_number || 
      !pan_number ||
      !nominee_name ||
      !nominee_relationship ||
      !address
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (aadhar_number.length !== 12 || !/^\d+$/.test(aadhar_number)) {
      res.status(400).json({ message: "Aadhar number must be 12 digits long" });
      return;
    }

    const existingAccount = await accountModel.findAccountByUserId(user_id);

    if (existingAccount) {
      res.status(409).json({ message: "You already have an account in this bank" });
      return;
    }

    const account_number = accountModel.generateAccountNumber();

    await accountModel.createAccount({
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

    res.status(201).json({ message: "Account application submitted successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
