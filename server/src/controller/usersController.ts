import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { UsersModel } from "../models/usersModels";
import { dbPool } from "../config/db";

const usersModel = new UsersModel(dbPool);

export const registerMobile = async (req: Request, res: Response) => {
  try {
    const { full_name, email, phone_number, password, confirm_password } = req.body;

    if (!full_name || !email || !phone_number || !password || !confirm_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

      const phonevalidation = /^\d{10}$/;
    if (!phonevalidation.test(phone_number)) {
      return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
    }

    if (password.length !== 6) {
      return res.status(400).json({ message: "Password must be exactly 6 characters long" });
    }

    
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await usersModel.findUserByPhone(phone_number);
    if (existingUser) {
      return res.status(409).json({ message: "This mobile number already exists" });
    }

    const Password = password;

    const newUser = {
      user_uuid: uuidv4(),
      full_name,
      email,
      phone_number,
      password_hash: Password,
    };

    const userId = await usersModel.createUser(newUser);
    return res.status(201).json({ message: "User registered successfully", user_id: userId });

  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
