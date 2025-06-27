import React from "react";
import { X } from "lucide-react";
import Button from "./Button";
import { ApproveAccount, RejectAccount } from "../api/AdminAccountsApi";
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
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full  mx-2 my-2 relative">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-[#004466]">
                  Account Details
                </h1>
                <p className="text-gray-600 text-sm">
                  Account {account.account_number}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                  account.status
                )}`}
              >
                {account.status.charAt(0).toUpperCase() +
                  account.status.slice(1)}
              </span>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                  {account.full_name}
                </div>
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Email
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                  {account.email || "N/A"}
                </div>
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Phone Number
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                  {account.phone_number}
                </div>
              </div>
            </div>
            <div>
              <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                Address
              </label>
              <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                {account.address}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 font-mono">
                  {account.account_number}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 capitalize">
                  {account.account_type.replace("_", " ")}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 font-semibold text-green-600">
                  {formatCurrency(account.balance)}
                </div>
              </div>
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  Date and Time
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 text-sm">
                  {new Date(account.created_at).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
          </div>

          {(account.aadhaar_number ||
            account.pan_number ||
            account.aadhaar_file ||
            account.pan_file) && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Identity Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {account.aadhaar_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar Number
                    </label>
                    <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 font-mono break-words">
                      {account.aadhaar_number}
                    </div>
                  </div>
                )}
                {account.pan_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN Number
                    </label>
                    <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 font-mono break-words">
                      {account.pan_number}
                    </div>
                  </div>
                )}
                {account.aadhaar_file && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aadhaar File
                    </label>
                    <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 break-words">
                      <a
                        href={`http://localhost:4000/${account.aadhaar_file.replace(
                          /\\/g,
                          "/"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Aadhaar File
                      </a>
                    </div>
                  </div>
                )}
                {account.pan_file && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PAN File
                    </label>
                    <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 break-words">
                      <a
                        href={`http://localhost:4000/${account.pan_file.replace(
                          /\\/g,
                          "/"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PAN File
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center">
              Nominee Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nominee Name
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200">
                  {account.nominee_name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship
                </label>
                <div className="px-4 py-2 rounded-md bg-gray-50 border border-gray-200 capitalize">
                  {account.nominee_relationship}
                </div>
              </div>
            </div>
          </div>
        </div>

        {["pending", "approved", "rejected"].includes(
          account.status?.trim().toLowerCase()
        ) && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                onClick={handleApprove}
                className="flex items-center space-x-2 px-5 py-2   bg-[#004466] hover:bg-[#8bdea3]"
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
        )}
      </div>
    </div>
  );
};

export default Card;
