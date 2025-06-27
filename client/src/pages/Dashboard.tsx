import React, { useEffect, useState } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import Section from "../components/Dashboard/Section";
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
    if (status === "approved")
      return (
        <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full">
          {status}
        </span>
      );
    if (status === "pending")
      return (
        <span className="text-yellow-700 bg-yellow-100 px-4 pb-1 rounded-full">
          {status}
        </span>
      );
    return (
      <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full">
        {status}
      </span>
    );
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
          <p className="mt-2 text-sm">
            Here’s a summary of your account and details.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard title="Account Number" value={user.account_number} />
          <SummaryCard title="Balance" value={formatCurrency(user.balance)} />
          <SummaryCard title="Status" value={getStatusBadge(user.status)} />
          <SummaryCard title="Account Type" value={user.account_type} />
        </div>

        {/* Personal Details */}
        <Section title="Personal Information">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 w-1/3">Field</th>
                <th className="p-2 w-2/3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Email</td>
                <td className="p-2 align-top">{user.email}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Phone Number</td>
                <td className="p-2 align-top">{user.phone_number}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Address</td>
                <td className="p-2 align-top">{user.address}</td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Account Info */}
        <Section title="Account Information">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 w-1/3">Field</th>
                <th className="p-2 w-2/3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Account Type</td>
                <td className="p-2 align-top">{user.account_type}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Account Number</td>
                <td className="p-2 align-top">{user.account_number}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Status</td>
                <td className="p-2 align-top">{getStatusBadge(user.status)}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Balance</td>
                <td className="p-2 align-top">
                  {formatCurrency(user.balance)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* KYC Info */}
        <Section title="KYC Details">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 w-1/3">Field</th>
                <th className="p-2 w-2/3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">Aadhaar Number</td>
                <td className="p-2 align-top">{user.aadhaar_number}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold align-top">PAN Number</td>
                <td className="p-2 align-top">{user.pan_number}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold align-top">Submitted On</td>
                <td className="p-2 align-top">
                  {formatDate(user.submitted_at)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* Nominee Info */}
        <Section title="Nominee Information">
          <table className="w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 w-1/3">Field</th>
                <th className="p-2 w-2/3">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-semibold align-top">Relationship</td>
                <td className="p-2 align-top">{user.nominee_relationship}</td>
              </tr>
            </tbody>
          </table>
        </Section>
      </div>
    </div>
  );
};

export default Dashboard;
