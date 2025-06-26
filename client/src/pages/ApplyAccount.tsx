import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
import { applyForAccount } from "../api/applyAccountApi";
import { toast } from "react-toastify";

const ApplyAccount: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    account_type: "",
    initial_deposit: "",
    aadhar_number: "",
    aadhar_file: null as File | null,
    pan_number: "",
    pan_file: null as File | null,
    nominee_name: "",
    nominee_relationship: "",
    address: "",
  });

  const [error, setError] = useState("");

  const accountTypeOptions = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
  ];

  const relationshipOptions = [
    { value: "spouse", label: "Spouse" },
    { value: "father", label: "Father" },
    { value: "mother", label: "Mother" },
    { value: "son", label: "Son" },
    { value: "daughter", label: "Daughter" },
    { value: "brother", label: "Brother" },
    { value: "sister", label: "Sister" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setFormData((prev) => ({
        ...prev,
        full_name: parsed.full_name || "",
        email: parsed.email || "",
        phone_number: parsed.phone_number || "",
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const {
      account_type,
      initial_deposit,
      aadhar_number,
      aadhar_file,
      pan_number,
      pan_file,
      nominee_name,
      nominee_relationship,
      address,
    } = formData;

    if (
      !account_type ||
      !initial_deposit ||
      !aadhar_number ||
      !aadhar_file ||
      !pan_number ||
      !pan_file ||
      !nominee_name ||
      !nominee_relationship ||
      !address
    ) {
      setError("Please fill all required fields!");
      return;
    }

    if (!/^\d{12}$/.test(aadhar_number)) {
      setError("Aadhar number must be exactly 12 digits!");
      return;
    }

    if (parseFloat(initial_deposit) <= 0) {
      setError("Initial deposit must be greater than 0!");
      return;
    }

    try {
      await applyForAccount({
        account_type,
        balance: parseFloat(initial_deposit),
        aadhar_number,
        aadhar_file: aadhar_file as File,
        pan_number,
        pan_file: pan_file as File,
        nominee_name,
        nominee_relationship,
        address,
      });
      toast("Account application submitted successfully!");
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        account_type: "",
        initial_deposit: "",
        aadhar_number: "",
        aadhar_file: null,
        pan_number: "",
        pan_file: null,
        nominee_name: "",
        nominee_relationship: "",
        address: "",
      });
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#004466] mb-2">Bank Account Application</h1>
            <p className="text-[#004466]">Fill in the details to open your new account</p>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#004466] mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name *"
                  name="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
                <Input
                  label="Email *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="Enter email"
                />
                <Input
                  label="Phone Number *"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  required
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Account Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#004466] mb-4">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Dropdown
                  label="Account Type *"
                  name="account_type"
                  value={formData.account_type}
                  onChange={(e) => setFormData({ ...formData, account_type: e.target.value })}
                  options={accountTypeOptions}
                  placeholder="Select account type"
                  required
                />
                <Input
                  label="Initial Deposit (₹) *"
                  type="number"
                  name="initial_deposit"
                  value={formData.initial_deposit}
                  onChange={(e) => setFormData({ ...formData, initial_deposit: e.target.value })}
                  required
                  placeholder="Enter amount"
                />
                <Input
                  label="Aadhar Number *"
                  name="aadhar_number"
                  value={formData.aadhar_number}
                  onChange={(e) => setFormData({ ...formData, aadhar_number: e.target.value })}
                  required
                  placeholder="Enter 12-digit Aadhar"
                />
              </div>
            </div>

            {/* Document Upload */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#004466] mb-4">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar File *</label>
                  <input
                    type="file"
                    name="aadhar_file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({ ...formData, aadhar_file: e.target.files?.[0] || null })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PAN File *</label>
                  <input
                    type="file"
                    name="pan_file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setFormData({ ...formData, pan_file: e.target.files?.[0] || null })
                    }
                    required
                  />
                </div>
                <Input
                  label="PAN Number *"
                  name="pan_number"
                  value={formData.pan_number}
                  onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                  required
                  placeholder="Enter PAN"
                />
              </div>
            </div>

            {/* Nominee Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#004466] mb-4">Nominee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Nominee Name *"
                  name="nominee_name"
                  value={formData.nominee_name}
                  onChange={(e) => setFormData({ ...formData, nominee_name: e.target.value })}
                  required
                  placeholder="Enter nominee name"
                />
                <Dropdown
                  label="Relationship *"
                  name="nominee_relationship"
                  value={formData.nominee_relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, nominee_relationship: e.target.value })
                  }
                  options={relationshipOptions}
                  placeholder="Select relationship"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-[#004466] mb-4">Address Information *</h2>
              <textarea
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                rows={3}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full address"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-6">
              <Button type="submit" className="px-8 py-3 text-lg font-semibold">
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyAccount;
