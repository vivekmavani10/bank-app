import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { getProfile, updateProfile } from "../api/editProfileApi";

interface EditProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchUserProfile();
  }, [isOpen]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await getProfile();
      setFormData({
        full_name: profile.full_name,
        email: profile.email,
        phone_number: profile.phone_number,
        address: profile.address || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.full_name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.address
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await updateProfile(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-lg">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#004466] mb-8 text-center">
          Edit Profile
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading profile...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm text-center mb-5">{error}</p>
            )}

            <div className="space-y-5">
              <Input
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              <Input
                label="Mobile Number"
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={3}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
