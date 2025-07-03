import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { AuthModel } from "../models/forgotPasswordModels";

const authModel = new AuthModel();

export const updatePasswordByAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { phone_number, new_password, confirm_password } = req.body;

    if (!phone_number || !new_password || !confirm_password) {
      res
        .status(400)
        .json({ status: "error", message: "All fields are required." });
      return;
    }

    if (!/^\d{10}$/.test(phone_number)) {
      res
        .status(400)
        .json({ status: "error", message: "Phone number must be 10 digits." });
      return;
    }

    if (new_password !== confirm_password) {
      res
        .status(400)
        .json({ status: "error", message: "Passwords do not match." });
      return;
    }

    const user = await authModel.findByPhoneNumber(phone_number);

    if (!user) {
      res
        .status(404)
        .json({
          status: "error",
          message: "User not found with this phone number.",
        });
      return;
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    const updated = await authModel.updatePassword(
      user.user_id,
      hashedPassword
    );

    if (updated) {
      res
        .status(200)
        .json({ status: "success", message: "Password updated successfully." });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Failed to update password." });
    }
  } catch (err) {
    console.error("Update password error:", err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
