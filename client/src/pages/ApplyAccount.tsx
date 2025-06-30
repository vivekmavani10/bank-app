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
      const message = await applyForAccount({
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

      toast.success(message);
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
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-4 px-4">
      <div className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#004466] mb-2">
            Apply for a Bank Account
          </h1>
          <p className="text-md text-gray-600">
            Please provide accurate details and upload required documents
          </p>
        </div>

        {error && <p className="text-red-500 text-center mb-6">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#004466] mb-6">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Full Name *"
                name="full_name"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                required
                placeholder="Enter full name"
              />
              <Input
                label="Email *"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                placeholder="Enter email"
              />
              <Input
                label="Phone Number *"
                name="phone_number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                required
                placeholder="Enter phone number"
              />
            </div>
          </section>

          {/* Account Details */}
          <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#004466] mb-6">
              Account Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Dropdown
                label="Account Type *"
                name="account_type"
                value={formData.account_type}
                onChange={(e) =>
                  setFormData({ ...formData, account_type: e.target.value })
                }
                options={accountTypeOptions}
                placeholder="Select account type"
                required
              />
              <Input
                label="Initial Deposit (₹) *"
                type="number"
                name="initial_deposit"
                value={formData.initial_deposit}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    initial_deposit: e.target.value,
                  })
                }
                required
                placeholder="Enter amount"
              />
              <Input
                label="Aadhar Number *"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={(e) =>
                  setFormData({ ...formData, aadhar_number: e.target.value })
                }
                required
                placeholder="Enter 12-digit Aadhar"
              />
            </div>
          </section>

          {/* Document Upload */}
          <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#004466] mb-6">
              Document Upload
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhar File *
                </label>
                <input
                  type="file"
                  name="aadhar_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aadhar_file: e.target.files?.[0] || null,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN File *
                </label>
                <input
                  type="file"
                  name="pan_file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pan_file: e.target.files?.[0] || null,
                    })
                  }
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <Input
                label="PAN Number *"
                name="pan_number"
                value={formData.pan_number}
                onChange={(e) =>
                  setFormData({ ...formData, pan_number: e.target.value })
                }
                required
                placeholder="Enter PAN"
              />
            </div>
          </section>

          {/* Nominee */}
          <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#004466] mb-6">
              Nominee Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nominee Name *"
                name="nominee_name"
                value={formData.nominee_name}
                onChange={(e) =>
                  setFormData({ ...formData, nominee_name: e.target.value })
                }
                required
                placeholder="Enter nominee name"
              />
              <Dropdown
                label="Relationship *"
                name="nominee_relationship"
                value={formData.nominee_relationship}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nominee_relationship: e.target.value,
                  })
                }
                options={relationshipOptions}
                placeholder="Select relationship"
                required
              />
            </div>
          </section>

          {/* Address */}
          <section className="p-6 bg-gray-50 border border-gray-200 rounded-xl">
            <h2 className="text-2xl font-semibold text-[#004466] mb-6">
              Address
            </h2>
            <textarea
              name="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              rows={4}
              className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-[#004466] focus:border-[#004466]"
              placeholder="Enter your full address"
            />
          </section>

          {/* Submit */}
          <div className="flex justify-center pt-6">
            <Button
              type="submit"
              className="px-8 py-3 text-lg font-semibold bg-[#004466] text-white hover:bg-[#00334d] rounded-xl shadow-md transition"
            >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyAccount;
  