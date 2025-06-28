import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Popup from "../components/Popup";

const Transaction: React.FC = () => {
  const [receiverAccount, setReceiverAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const validateForm = (): boolean => {
    if (!receiverAccount || !amount) {
      setError("Please fill in all fields.");
      return false;
    }

    if (isNaN(Number(receiverAccount)) || receiverAccount.length !== 12) {
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

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPopup(true);
    }
  };

  const handleConfirmTransfer = () => {
    console.log("Transfer details:", {
      receiverAccount,
      amount,
      description,
    });

    alert("Transfer submitted!");

    setReceiverAccount("");
    setAmount("");
    setDescription("");
    setShowPopup(false);
  };

  return (
    <div className="min-h-[calc(97vh-90px)] bg-[#f4f8fb] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          Money Transfer
        </h2>

        <form onSubmit={handleTransfer}>
          {error && (
            <p className="text-red-500 text-sm text-center mb-5">{error}</p>
          )}

          <div className="space-y-5">
            <Input
              label="Receiver's Account Number"
              type="text"
              name="receiverAccount"
              value={receiverAccount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,12}$/.test(value)) {
                  setReceiverAccount(value);
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
              placeholder="Enter amount to transfer"
            />

            <Input
              label="Description"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Rent, Salary, etc."
            />

            <Button type="submit" className="w-full mt-4">
              Transfer
            </Button>
          </div>
        </form>
      </div>

      {showPopup && (
        <Popup
          title="Confirm Transfer"
          message={`Are you sure you want to transfer ₹${amount} to A/C ${receiverAccount}?`}
          onConfirm={handleConfirmTransfer}
          onCancel={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default Transaction;
