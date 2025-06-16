import React from "react";
import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
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
  };

  return (
    <div>
      <div className="bg-gray-100 p-5 border-none rounded-lg flex items-center justify-center min-h-[calc(100vh-95px)]">
        <div className="bg-white p-6 border-none rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold text-center">
            Login to KV Bank
          </h1>
          <form className="mt-5" onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
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
            //   required={true}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            //   required={true}
            />
            <Button type="submit" children="Login" className="w-full mt-2" />
          </form>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-gray-950">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
