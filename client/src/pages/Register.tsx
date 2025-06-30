import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { registerUser } from "../api/authApi";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !password || !confirmPassword) {
      setError("Please fill all fields!");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address!");
      return;
    }

    if (phone.length !== 10 || isNaN(Number(phone))) {
      setError("Please enter a valid phone number!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const { message } = await registerUser({
        full_name: name,
        email: email,
        phone_number: phone,
        password: password,
        confirm_password: confirmPassword,
      });

      console.log("Registration successful:", message);
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] bg-gradient-to-br from-gray-50 to-white py-4 px-4 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-[#004466]">
          Register to <span className="text-[#d7555e]">KV Bank</span>
        </h1>
        <form className="mt-5" onSubmit={handleRegister}>
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}
          <Input
            label="Full Name"
            type="text"
            name="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <Input
            label="Phone Number"
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,10}$/.test(value)) {
                setPhone(value);
              }
            }}
            placeholder="Enter your phone number"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          <Button type="submit" className="w-full mt-4">
            Register
          </Button>
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#d7555e] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
