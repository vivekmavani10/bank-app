import React, { useState } from "react";
import SummaryCard from "../components/Dashboard/SummaryCard";
import Section from "../components/Dashboard/Section";

const AdminDashboard: React.FC = () => {
  const [error] = useState<string>("");

  const overview = {
    totalUsers: 1200,
    approvedAccounts: 950,
    pendingAccounts: 150,
    totalTransactions: 3245,
    totalBalance: 8745000,
  };

  const applications = [
    {
      account_id: 1,
      full_name: "John Doe",
      account_type: "savings",
      status: "pending",
      created_at: new Date().toISOString(),
    },
    {
      account_id: 2,
      full_name: "Jane Smith",
      account_type: "current",
      status: "approved",
      created_at: new Date().toISOString(),
    },
  ];

  const kycDocs = [
    {
      kyc_id: 1,
      aadhaar_number: "1234-5678-9012",
      pan_number: "ABCDE1234F",
      aadhaar_file: "aadhaar.pdf",
      pan_file: "pan.pdf",
    },
  ];

  const transactions = [
    {
      transaction_id: 1,
      from_account_id: "1001",
      to_account_id: "1002",
      amount: 5000,
      transaction_type: "credit",
      created_at: new Date().toISOString(),
      status: "success",
    },
  ];

  const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

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
      return <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full">{status}</span>;
    if (status === "pending")
      return <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">{status}</span>;
    return <span className="text-red-700 bg-red-100 px-2 py-1 rounded-full">{status}</span>;
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-red-600 font-semibold text-xl">
        {error}
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
          <SummaryCard title="Total Users" value={String(overview.totalUsers)} />
          <SummaryCard title="Approved Accounts" value={String(overview.approvedAccounts)} />
          <SummaryCard title="Pending Applications" value={String(overview.pendingAccounts)} />
          <SummaryCard title="Total Transactions" value={String(overview.totalTransactions)} />
          <SummaryCard title="Total Bank Balance" value={formatCurrency(overview.totalBalance)} />
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
                {applications.map((app) => (
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
            {applications.map((app) => (
              <div key={app.account_id} className="bg-white p-4 rounded-lg shadow-md border space-y-2">
                <div className="text-base font-semibold">{app.full_name}</div>
                <div className="text-sm text-gray-600">Account Type: <span className="capitalize">{app.account_type}</span></div>
                <div className="text-sm text-gray-600">Status: {getStatusBadge(app.status)}</div>
                <div className="text-sm text-gray-600">Applied At: {formatDate(app.created_at)}</div>
                <div className="flex gap-4 pt-2">
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Approve</button>
                  <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* KYC Review Section */}
        <Section title="KYC Documents">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Aadhaar</th>
                  <th className="p-2">PAN</th>
                  <th className="p-2">Aadhaar File</th>
                  <th className="p-2">PAN File</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycDocs.map((doc) => (
                  <tr key={doc.kyc_id} className="border-b">
                    <td className="p-2">{doc.aadhaar_number}</td>
                    <td className="p-2">{doc.pan_number}</td>
                    <td className="p-2">
                      <a href={`/${doc.aadhaar_file}`} target="_blank" className="text-blue-600 underline">View</a>
                    </td>
                    <td className="p-2">
                      <a href={`/${doc.pan_file}`} target="_blank" className="text-blue-600 underline">View</a>
                    </td>
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
            {kycDocs.map((doc) => (
              <div key={doc.kyc_id} className="bg-white p-4 rounded-lg shadow-md border space-y-2">
                <p className="text-sm"><strong>Aadhaar:</strong> {doc.aadhaar_number}</p>
                <p className="text-sm"><strong>PAN:</strong> {doc.pan_number}</p>
                <p className="text-sm"><strong>Aadhaar File:</strong> <a href={`/${doc.aadhaar_file}`} target="_blank" className="text-blue-600 underline ml-1">View</a></p>
                <p className="text-sm"><strong>PAN File:</strong> <a href={`/${doc.pan_file}`} target="_blank" className="text-blue-600 underline ml-1">View</a></p>
                <div className="flex gap-4 pt-2">
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Approve</button>
                  <button className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Reject</button>
                </div>
              </div>
            ))}
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
                {transactions.map((txn) => (
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
            {transactions.map((txn) => (
              <div key={txn.transaction_id} className="bg-white p-4 rounded-lg shadow-md border space-y-2">
                <p className="text-sm"><strong>From:</strong> {txn.from_account_id || "-"}</p>
                <p className="text-sm"><strong>To:</strong> {txn.to_account_id || "-"}</p>
                <p className="text-sm"><strong>Amount:</strong> {formatCurrency(txn.amount)}</p>
                <p className="text-sm"><strong>Type:</strong> <span className="capitalize">{txn.transaction_type}</span></p>
                <p className="text-sm"><strong>Date:</strong> {formatDate(txn.created_at)}</p>
                <p className="text-sm"><strong>Status:</strong> <span className="text-green-700 font-medium">{txn.status}</span></p>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboard;
