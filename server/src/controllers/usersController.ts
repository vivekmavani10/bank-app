import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { UsersModel } from "../models/usersModels";
import { dbPool } from "../config/db";
import jwt from "jsonwebtoken";

const usersModel = new UsersModel(dbPool);

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, phone_number, password, confirm_password } =
      req.body;

    if (
      !full_name ||
      !email ||
      !phone_number ||
      !password ||
      !confirm_password
    ) {
      res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
      return;
    }

    const emailValidation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneValidation = /^\d{10}$/;

    if (!phoneValidation.test(phone_number)) {
      res.status(400).json({
        status: "error",
        message: "Phone number must be exactly 10 digits",
      });
      return;
    }

    if (!emailValidation.test(email)) {
      res
        .status(400)
        .json({ status: "error", message: "Invalid email format" });
      return;
    }

    if (password.length !== 6) {
      res.status(400).json({
        status: "error",
        message: "Password must be exactly 6 characters long",
      });
      return;
    }

    if (password !== confirm_password) {
      res
        .status(400)
        .json({ status: "error", message: "Passwords do not match" });
      return;
    }

    const existingUser = await usersModel.findUserByPhone(phone_number);
    if (existingUser) {
      res.status(409).json({
        status: "error",
        message: "This mobile number already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      user_uuid: uuidv4(),
      full_name,
      email,
      phone_number,
      role: "customer",
      password_hash: hashedPassword,
    };

    const userId = await usersModel.createUser(newUser);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { user_id: userId },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number, password } = req.body;

    const jwtSecret = process.env.JWT_SECRET as string;

    if (!phone_number || !password) {
      res.status(400).json({
        status: "error",
        message: "Phone number and password are required",
      });
      return;
    }

    if (!/^\d{10}$/.test(phone_number)) {
      res.status(400).json({
        status: "error",
        message: "Phone number must be 10 digits long",
      });
      return;
    }

    const user = await usersModel.findUserByPhone(phone_number);
    if (!user) {
      res.status(404).json({ status: "error", message: "Register first!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      res.status(401).json({ status: "error", message: "Invalid password" });
      return;
    }

    // Prepare JWT payload
    const payload = {
      user_uuid: user.user_uuid,
      user_id: user.user_id,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    } as jwt.SignOptions);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
