import { Request, Response } from "express";
import { AccountModel } from "../models/accountModels";
import { dbPool } from "../config/db";
import { v4 as uuidv4 } from "uuid";

const accountModel = new AccountModel(dbPool);

export const createAccount = async (req: Request, res: Response): Promise<void> => {
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

    res.status(201).json({ message: "Account application submitted successfully" , account_uuid,});
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get logged in user's account details
export const getAccountDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_id = (req as any).user?.user_id;

    if (!user_id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const account = await accountModel.getAccountDetailsByUserId(user_id);

    if (!account) {
      res.status(404).json({ message: "Account not found" });
      return;
    }

    res.status(200).json(account);
  } catch (error) {
    console.error("Error fetching account details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};