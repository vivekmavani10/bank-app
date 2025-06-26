import React, { useEffect, useState } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import Section from "../components/Dashboard/Section";
import Info from "../components/Dashboard/Info";
import { getDashboardData } from "../api/dashboardApi";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardData();
        setUser(data);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-50 px-4 space-y-6 min-h-[calc(97vh-90px)]">
        <div className="max-w-md w-full">
          <SummaryCard title="Oops! Something went wrong" value={error} />
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            If you want to apply for a new account, click below.
          </p>
          <button
            onClick={() => navigate("/dashboard/apply-account")}
            className="bg-[#004466] hover:bg-[#003348] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Apply for Account
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 bg-[#004466] text-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold">Welcome, {user.full_name} 👋</h1>
          <p className="mt-2">Here's a summary of your account information.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Account Number" value={user.account_number} />
          <SummaryCard title="Balance" value={`₹${user.balance}`} />
          <SummaryCard title="Status" value={user.status} />
          <SummaryCard title="Account Type" value={user.account_type} />
        </div>

        {/* Detail Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Section title="Personal Information">
            <Info label="Email" value={user.email} />
            <Info label="Phone Number" value={user.phone_number} />
            <Info label="Address" value={user.address} />
          </Section>

          <Section title="Account Information">
            <Info label="Account Type" value={user.account_type} />
            <Info label="Account Number" value={user.account_number} />
            <Info label="Status" value={user.status} />
            <Info label="Balance" value={`₹${user.balance}`} />
          </Section>

          <Section title="KYC Details">
            <Info label="Aadhaar Number" value={user.aadhaar_number} />
            <Info label="PAN Number" value={user.pan_number} />
            <Info
              label="Submitted On"
              value={new Date(user.submitted_at).toLocaleString()}
            />
          </Section>

          <Section title="Nominee Information">
            <Info label="Relationship" value={user.nominee_relationship} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
