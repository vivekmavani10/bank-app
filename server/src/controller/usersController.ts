import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { UsersModel } from "../models/usersModels";
import { dbPool } from "../config/db";

const usersModel = new UsersModel(dbPool);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, phone_number, password, confirm_password } = req.body;

    if (!full_name || !email || !phone_number || !password || !confirm_password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    if (phone_number.length !== 10 || !/^\d+$/.test(phone_number)) {
      res.status(400).json({ message: "Phone number must be 10 digits long" });
      return;
    }

    if (password !== confirm_password) {
      res.status(400).json({ message: "Passwords do not match" });
      return;
    }

    const existingUser = await usersModel.findUserByPhone(phone_number);
    if (existingUser) {
      res.status(409).json({ message: "This mobile number already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      user_uuid: uuidv4(),
      full_name,
      email,
      phone_number,
      password_hash: hashedPassword,
    };

    const userId = await usersModel.createUser(newUser);

    res.status(201).json({ message: "User registered successfully", user_id: userId });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
