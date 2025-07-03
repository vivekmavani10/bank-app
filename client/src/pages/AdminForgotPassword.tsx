import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { resetPasswordByAdmin } from "../api/adminforgetpasswordApi";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [mobile, setMobile] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = (): boolean => {
    if (!mobile || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return false;
    }

    if (!/^\d{10}$/.test(mobile)) {
      setError("Mobile number must be 10 digits.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await resetPasswordByAdmin({
        phone_number: mobile,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success(" Password reset successful!");
      setMobile("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    } catch (err: any) {
      toast.error("password reset failed");
      setSuccess("");
    }
  };
  return (
    <div className="min-h-[calc(97vh-90px)] bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          Forgot Password
        </h2>

        <form onSubmit={handleResetPassword}>
          {error && (
            <p className="text-red-500 text-sm text-center mb-5">{error}</p>
          )}

          <div className="space-y-5">
            <Input
              label="Mobile Number"
              type="text"
              name="mobile"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setMobile(value);
                }
              }}
              placeholder="Enter 10-digit mobile number"
            />

            <Input
              label="New Password"
              type="password"
              name="new_password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <Button type="submit" className="w-full mt-4">
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
