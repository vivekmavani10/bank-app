import React, { useEffect, useState } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import Section from "../components/Dashboard/Section";
import { getAdminDashboardData } from "../api/dashboardApi";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAdminDashboardData();
        setDashboardData(data);
      } catch (error: any) {
        setError(error.message);
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
        <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
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
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-600 font-semibold text-xl">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10 bg-[#004466] text-white p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-2">Manage and monitor all user and bank activity.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <SummaryCard
            title="Total Users"
            value={String(dashboardData.totalUsers)}
          />
          <SummaryCard
            title="Approved Accounts"
            value={String(dashboardData.totalApprovedAccounts)}
          />
          <SummaryCard
            title="Pending Applications"
            value={String(dashboardData.totalPendingAccounts)}
          />
          <SummaryCard
            title="Total Transactions"
            value={String(dashboardData.totalTransactions)}
          />
          <SummaryCard
            title="Total Bank Balance"
            value={formatCurrency(Number(dashboardData.totalBankBalance))}
          />
        </div>

        {/* Applications Section */}
        <Section title="Recent Account Applications">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Name</th>
                  <th className="p-2">Account Type</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Applied At</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentAccountApplications?.map((app: any) => (
                  <tr key={app.account_id} className="border-b">
                    <td className="p-2">{app.full_name}</td>
                    <td className="p-2 capitalize">{app.account_type}</td>
                    <td className="p-2">{getStatusBadge(app.status)}</td>
                    <td className="p-2">{formatDate(app.created_at)}</td>
                    <td className="p-2 space-x-2">
                      <button className="text-green-600">Approve</button>
                      <button className="text-red-600">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {dashboardData.recentAccountApplications?.map((app: any) => (
              <div
                key={app.account_id}
                className="bg-white p-4 rounded-lg shadow-md border space-y-2"
              >
                <div className="text-base font-semibold">{app.full_name}</div>
                <div className="text-sm text-gray-600">
                  Account Type:{" "}
                  <span className="capitalize">{app.account_type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  Status: {getStatusBadge(app.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Applied At: {formatDate(app.created_at)}
                </div>
                <div className="flex gap-4 pt-2">
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Approve
                  </button>
                  <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className="text-black text-center mt-3 cursor-pointer underline"
            onClick={() => navigate("/admin-dashboard/accounts")}
          >
            View All Applications
          </div>
        </Section>

        {/* Recent Transactions */}
        <Section title="Recent Transactions">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">From</th>
                  <th className="p-2">To</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransactions?.map((txn: any) => (
                  <tr key={txn.transaction_id} className="border-b">
                    <td className="p-2">{txn.from_account_id || "-"}</td>
                    <td className="p-2">{txn.to_account_id || "-"}</td>
                    <td className="p-2">{formatCurrency(txn.amount)}</td>
                    <td className="p-2 capitalize">{txn.transaction_type}</td>
                    <td className="p-2">{formatDate(txn.created_at)}</td>
                    <td className="p-2 text-green-600">{txn.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {dashboardData.recentTransactions?.map((txn: any) => (
              <div
                key={txn.transaction_id}
                className="bg-white p-4 rounded-lg shadow-md border space-y-2"
              >
                <p className="text-sm">
                  <strong>From:</strong> {txn.from_account_id || "-"}
                </p>
                <p className="text-sm">
                  <strong>To:</strong> {txn.to_account_id || "-"}
                </p>
                <p className="text-sm">
                  <strong>Amount:</strong> {formatCurrency(txn.amount)}
                </p>
                <p className="text-sm">
                  <strong>Type:</strong>{" "}
                  <span className="capitalize">{txn.transaction_type}</span>
                </p>
                <p className="text-sm">
                  <strong>Date:</strong> {formatDate(txn.created_at)}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong>{" "}
                  <span className="text-green-700 font-medium">
                    {txn.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div
            className="text-black text-center mt-3 cursor-pointer underline"
            onClick={() => navigate("/admin-dashboard/transactions")}
          >
            View All Applications
          </div>
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboard;
