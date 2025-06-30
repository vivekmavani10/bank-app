import React from "react";
import { X } from "lucide-react";
import Button from "./Button";
import { ApproveAccount, RejectAccount } from "../api/adminAccountsApi";
import { toast } from "react-toastify";

interface CardProps {
  account: {
    account_uuid: string;
    full_name: string;
    email?: string;
    phone_number: string;
    address: string;
    account_number: string;
    account_type: string;
    balance: number;
    status: string;
    nominee_name: string;
    nominee_relationship: string;
    created_at: string;
    aadhaar_number?: string;
    pan_number?: string;
    pan_file?: string;
    aadhaar_file?: string;
  };
  onClose: () => void;
  onStatusUpdate: (newStatus: string) => void;
}

const Card: React.FC<CardProps> = ({ account, onClose, onStatusUpdate }) => {
  const handleApprove = async () => {
    try {
      await ApproveAccount(account.account_uuid);
      toast.success("Account approved!");
      onStatusUpdate("approved");
      onClose();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const handleReject = async () => {
    try {
      await RejectAccount(account.account_uuid);
      toast.success("Account rejected!");
      onStatusUpdate("rejected");
      onClose();
    } catch (err) {
      toast.error("Rejection failed");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full relative border border-gray-100 overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-[#004466]">
              Account Details
            </h1> 
            <p className="text-sm text-gray-500">
              Account #{account.account_number}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                account.status
              )} shadow-sm`}
            >
              {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {/* Personal Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Full Name", value: account.full_name },
                { label: "Email", value: account.email || "N/A" },
                { label: "Phone Number", value: account.phone_number },
                { label: "Address", value: account.address, full: true },
              ].map((field, i) => (
                <div
                  key={i}
                  className={field.full ? "md:col-span-2 lg:col-span-3" : ""}
                >
                  <label className="text-sm font-medium text-gray-600 block mb-1">
                    {field.label}
                  </label>
                  <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-md">
                    {field.value}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Account Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Account Information
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Number
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 font-mono">
                  {account.account_number}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Account Type
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 capitalize">
                  {account.account_type.replace("_", " ")}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Balance
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-green-600 font-semibold">
                  {formatCurrency(account.balance)}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Created At
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-sm">
                  {new Date(account.created_at).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </section>

          {/* Identity Info */}
          {(account.aadhaar_number ||
            account.pan_number ||
            account.aadhaar_file ||
            account.pan_file) && (
            <section>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Identity Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {account.aadhaar_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      Aadhaar Number
                    </label>
                    <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-md font-mono">
                      {account.aadhaar_number}
                    </div>
                  </div>
                )}
                {account.pan_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      PAN Number
                    </label>
                    <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-md font-mono">
                      {account.pan_number}
                    </div>
                  </div>
                )}
                {account.aadhaar_file && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      Aadhaar File
                    </label>
                    <a
                      href={`http://localhost:4000/${account.aadhaar_file.replace(
                        /\\/g,
                        "/"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Aadhaar File
                    </a>
                  </div>
                )}
                {account.pan_file && (
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-1 block">
                      PAN File
                    </label>
                    <a
                      href={`http://localhost:4000/${account.pan_file.replace(
                        /\\/g,
                        "/"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View PAN File
                    </a>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Nominee Info */}
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
              Nominee Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Nominee Name
                </label>
                <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-md">
                  {account.nominee_name}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">
                  Relationship
                </label>
                <div className="bg-gray-50 px-4 py-2 border border-gray-200 rounded-md capitalize">
                  {account.nominee_relationship}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              onClick={handleApprove}
              className="flex items-center space-x-2 px-5 py-2 bg-[#004466] hover:bg-[#8bdea3]"
            >
              <span>Approve</span>
            </Button>
            <Button
              type="button"
              onClick={handleReject}
              className="flex items-center space-x-2 px-8 py-2"
            >
              <span>Reject</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
