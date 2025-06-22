import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";

interface FormData {
  full_name: string;
  email: string;
  phone_number: string;
  account_type: string;
  initial_deposit: string;
  aadhar_number: string;
  aadhar_file: File | null;
  pan_number: string;
  pan_file: File | null;
  nominee_name: string;
  nominee_relationship: string;
  address: string;
}

const ApplyAccount: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Account type options
  const accountTypeOptions = [
    { value: "savings", label: "Savings Account" },
    { value: "current", label: "Current Account" },
    { value: "fixed_deposit", label: "Fixed Deposit" },
    { value: "salary", label: "Salary Account" },
  ];

  // Nominee relationship options
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

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      // Get user data from localStorage
      const userDataString = localStorage.getItem("user");
      
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        
        setFormData(prev => ({
          ...prev,
          full_name: userData.full_name || "",
          email: userData.email || "",
          phone_number: userData.phone_number || "",
        }));
      }
    } catch (error) {
      console.error("Error loading user data from localStorage:", error);
      // If there's an error, keep the fields empty for manual entry
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle dropdown changes
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0] || null;
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData(prev => ({
      ...prev,
      [name]: file,
    }));
  };

  // Validate Aadhar number (12 digits)
  const validateAadhar = (aadhar: string): boolean => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required field validation
    if (!formData.account_type) newErrors.account_type = "Account type is required";
    if (!formData.initial_deposit) newErrors.initial_deposit = "Initial deposit is required";
    if (!formData.aadhar_number) newErrors.aadhar_number = "Aadhar number is required";
    if (!formData.aadhar_file) newErrors.aadhar_file = "Aadhar file is required";
    if (!formData.pan_number) newErrors.pan_number = "PAN number is required";
    if (!formData.pan_file) newErrors.pan_file = "PAN file is required";
    if (!formData.nominee_name) newErrors.nominee_name = "Nominee name is required";
    if (!formData.nominee_relationship) newErrors.nominee_relationship = "Nominee relationship is required";
    if (!formData.address) newErrors.address = "Address is required";

    // Aadhar number validation
    if (formData.aadhar_number && !validateAadhar(formData.aadhar_number)) {
      newErrors.aadhar_number = "Aadhar number must be exactly 12 digits";
    }

    // Initial deposit validation
    if (formData.initial_deposit && parseFloat(formData.initial_deposit) <= 0) {
      newErrors.initial_deposit = "Initial deposit must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted successfully:", formData);
      alert("Account application submitted successfully!");
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-100"
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-100"
                  placeholder="Enter your email"
                />
                
                <Input
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-100"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            {/* Account Details Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                  <Dropdown
                    label="Account Type"
                    name="account_type"
                    value={formData.account_type}
                    onChange={handleDropdownChange}
                    options={accountTypeOptions}
                    placeholder="Select account type"
                    required
                  />
                  {errors.account_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.account_type}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <Input
                    label="Initial Deposit (₹)"
                    type="number"
                    name="initial_deposit"
                    value={formData.initial_deposit}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter initial deposit amount"
                  />
                  {errors.initial_deposit && (
                    <p className="text-red-500 text-sm mt-1">{errors.initial_deposit}</p>
                  )}
                </div>

                <div className="mb-4">
                  <Input
                    label="Aadhar Number"
                    name="aadhar_number"
                    value={formData.aadhar_number}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter 12-digit Aadhar number"
                    // maxLength={12}
                  />
                  {errors.aadhar_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.aadhar_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Upload</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aadhar File Upload *
                  </label>
                  <input
                    type="file"
                    name="aadhar_file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.aadhar_file && (
                    <p className="text-red-500 text-sm mt-1">{errors.aadhar_file}</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PAN File Upload *
                  </label>
                  <input
                    type="file"
                    name="pan_file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.pan_file && (
                    <p className="text-red-500 text-sm mt-1">{errors.pan_file}</p>
                  )}
                </div>

                <div className="mb-4">
                  <Input
                    label="PAN Number"
                    name="pan_number"
                    value={formData.pan_number}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter PAN number"
                  />
                  {errors.pan_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.pan_number}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nominee Information Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Nominee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <Input
                    label="Nominee Name"
                    name="nominee_name"
                    value={formData.nominee_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter nominee name"
                  />
                  {errors.nominee_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.nominee_name}</p>
                  )}
                </div>

                <div className="mb-4">
                  <Dropdown
                    label="Nominee Relationship"
                    name="nominee_relationship"
                    value={formData.nominee_relationship}
                    onChange={handleDropdownChange}
                    options={relationshipOptions}
                    placeholder="Select relationship"
                    required
                  />
                  {errors.nominee_relationship && (
                    <p className="text-red-500 text-sm mt-1">{errors.nominee_relationship}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Address Information</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complete Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Enter your complete address"
                  className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                className="px-8 py-3 text-lg font-semibold"
              >
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