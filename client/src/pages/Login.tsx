import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { loginUser } from "../api/auth";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!phone || !password) {
      setError("Please fill all fields!");
      return;
    }

    if (phone.length !== 10 || isNaN(Number(phone))) {
      setError("Please enter a valid phone number!");
      return;
    }

    try {
      const { token, message, data } = await loginUser({
        phone_number: phone,
        password,
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(data));

      console.log("Login successful:", message);
      // Redirect if needed
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-[calc(100vh-95px)] pt-24 pb-16">
      <div className="flex items-center justify-center px-6">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-[#004466]">
            Login to <span className="text-[#d7555e]">KV Bank</span>
          </h1>
          <form className="mt-5" onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

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
            <Button
              type="submit"
              className="w-full mt-2 bg-[#d7555e] text-white py-2 rounded-full hover:bg-[#e799aa] transition"
            >
              Login
            </Button>
          </form>

          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#d7555e] font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
