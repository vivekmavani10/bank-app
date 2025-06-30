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
    const base = "inline-block text-xs px-3 py-1 rounded-full font-medium";
    if (status === "approved")
      return (
        <span className={`${base} bg-green-100 text-green-700`}>{status}</span>
      );
    if (status === "pending")
      return (
        <span className={`${base} bg-yellow-100 text-yellow-700`}>
          {status}
        </span>
      );
    return <span className={`${base} bg-red-100 text-red-700`}>{status}</span>;
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
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto space-y-12">
        {/* Header */}
        <div className="bg-[#004466] text-white p-6 sm:p-8 rounded-2xl shadow-lg">
          <h1 className="text-3xl sm:text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-sm sm:text-base opacity-90">
            Monitor all user accounts and transaction activity in real time.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

        {/* Applications Table */}
        <Section title="Recent Account Applications">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Account Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Applied At</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentAccountApplications?.map(
                  (app: any, idx: number) => (
                    <tr
                      key={app.account_id}
                      className={
                        idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <td className="px-4 py-3 font-medium">{app.full_name}</td>
                      <td className="px-4 py-3 capitalize">
                        {app.account_type}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(app.created_at)}
                      </td>
                      <td className="px-4 py-3 space-x-2">
                        <button className="text-green-700 hover:underline">
                          Approve
                        </button>
                        <button className="text-red-700 hover:underline">
                          Reject
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden mt-4">
            {dashboardData.recentAccountApplications?.map((app: any) => (
              <div
                key={app.account_id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-2"
              >
                <p className="font-semibold text-base">{app.full_name}</p>
                <p className="text-sm text-gray-600">
                  Type: <span className="capitalize">{app.account_type}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Status: {getStatusBadge(app.status)}
                </p>
                <p className="text-sm text-gray-600">
                  Applied: {formatDate(app.created_at)}
                </p>
                <div className="flex gap-4 pt-1">
                  <button className="text-green-700 hover:underline text-sm">
                    Approve
                  </button>
                  <button className="text-red-700 hover:underline text-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            className="text-center mt-4 text-sm text-black-700 hover:text-black-900 underline cursor-pointer"
            onClick={() => navigate("/admin-dashboard/accounts")}
          >
            View All Applications
          </div>
        </Section>

        {/* Transactions Table */}
        <Section title="Recent Transactions">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-3">From</th>
                  <th className="px-4 py-3">To</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentTransactions?.map(
                  (txn: any, idx: number) => (
                    <tr
                      key={txn.transaction_id}
                      className={
                        idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50 hover:bg-gray-100"
                      }
                    >
                      <td className="px-4 py-3">{txn.sender_account || "-"}</td>
                      <td className="px-4 py-3">
                        {txn.receiver_account || "-"}
                      </td>
                      <td className="px-4 py-3">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {txn.transaction_type}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(txn.created_at)}
                      </td>
                      <td className="px-4 py-3 text-green-700 font-medium">
                        {txn.status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-4 md:hidden mt-4">
            {dashboardData.recentTransactions?.map((txn: any) => (
              <div
                key={txn.transaction_id}
                className="bg-white border rounded-xl p-4 shadow-sm space-y-2"
              >
                <p className="text-sm">
                  <strong>From:</strong> {txn.sender_account || "-"}
                </p>
                <p className="text-sm">
                  <strong>To:</strong> {txn.receiver_account || "-"}
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
                  <span className="text-green-700">{txn.status}</span>
                </p>
              </div>
            ))}
          </div>

          <div
            className="text-center mt-4 text-sm text-black-700 hover:text-black-900 underline cursor-pointer"
            onClick={() => navigate("/admin-dashboard/transactions")}
          >
            View All Transactions
          </div>
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboard;
