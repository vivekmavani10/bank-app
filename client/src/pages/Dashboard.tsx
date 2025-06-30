import React, { useEffect, useState } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import Section from "../components/Dashboard/Section";
import { getDashboardData } from "../api/dashboardApi";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: string) => {
    const base = "inline-block text-xl px-3 py-1 rounded-full font-medium";
    if (status === "approved")
      return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
    if (status === "pending")
      return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
    return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
  };

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
          <Button
            onClick={() => navigate("/dashboard/apply-account")}
          >
            Apply For Account
          </Button>
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto space-y-10">

        {/* Welcome Section */}
        <div className="bg-[#004466] text-white p-6 sm:p-8 rounded-xl shadow-md text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold">Welcome, {user.full_name} 👋</h1>
          <p className="mt-2 text-sm sm:text-base opacity-90">
            Here’s a summary of your account and details.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Account Number" value={user.account_number} />
          <SummaryCard title="Balance" value={formatCurrency(user.balance)} />
          <SummaryCard title="Status" value={getStatusBadge(user.status)} />
          <SummaryCard title="Account Type" value={user.account_type} />
        </div>

        {/* Personal Info */}
        <Section title="Personal Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Email</p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Phone Number</p>
              <p className="text-gray-800 font-medium">{user.phone_number}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500 mb-1">Address</p>
              <p className="text-gray-800 font-medium">{user.address}</p>
            </div>
          </div>
        </Section>

        {/* Account Info */}
        <Section title="Account Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Account Type</p>
              <p className="text-gray-800 font-medium">{user.account_type}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Account Number</p>
              <p className="text-gray-800 font-medium">{user.account_number}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Status</p>
              <p className="text-gray-800 font-medium">{getStatusBadge(user.status)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Balance</p>
              <p className="text-gray-800 font-medium">{formatCurrency(user.balance)}</p>
            </div>
          </div>
        </Section>

        {/* KYC Info */}
        <Section title="KYC Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 mb-1">Aadhaar Number</p>
              <p className="text-gray-800 font-medium">{user.aadhaar_number}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">PAN Number</p>
              <p className="text-gray-800 font-medium">{user.pan_number}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-gray-500 mb-1">Submitted On</p>
              <p className="text-gray-800 font-medium">{formatDate(user.submitted_at)}</p>
            </div>
          </div>
        </Section>

        {/* Nominee Info */}
        <Section title="Nominee Information">
          <div className="text-sm">
            <p className="text-gray-500 mb-1">Relationship</p>
            <p className="text-gray-800 font-medium">{user.nominee_relationship}</p>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
