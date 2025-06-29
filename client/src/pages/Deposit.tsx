import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Popup from "../components/Popup";

const Deposit: React.FC = () => {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = (): boolean => {
    if (!accountNumber || !amount) {
      setError("Please fill in all fields.");
      return false;
    }

    if (isNaN(Number(accountNumber)) || accountNumber.length !== 12) {
      setError("Please enter a valid 12-digit account number.");
      return false;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount.");
      return false;
    }

    setError("");
    return true;
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPopup(true);
    }
  };

  const handleConfirmDeposit = () => {
    console.log("Deposit details:", {
      accountNumber,
      amount,
      description,
    });

    alert("Deposit successful!");

    setAccountNumber("");
    setAmount("");
    setDescription("");
    setShowPopup(false);
  };

  return (
    <div className="min-h-[calc(97vh-90px)] bg-[#f4f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          Deposit Money
        </h2>

        <form onSubmit={handleDeposit}>
          {error && (
            <p className="text-red-500 text-sm text-center mb-5">{error}</p>
          )}

          <div className="space-y-5">
            <Input
              label="Account Number"
              type="text"
              name="accountNumber"
              value={accountNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,12}$/.test(value)) {
                  setAccountNumber(value);
                }
              }}
              placeholder="Enter 12-digit account number"
            />

            <Input
              label="Amount (₹)"
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter deposit amount"
            />

            <Input
              label="Description"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Initial deposit, Adjustment"
            />

            <Button type="submit" className="w-full mt-4">
              Deposit
            </Button>
          </div>
        </form>
      </div>

      {showPopup && (
        <Popup
          title="Confirm Deposit"
          message={`Are you sure you want to deposit ₹${amount} into A/C ${accountNumber}?`}
          onConfirm={handleConfirmDeposit}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Deposit;
