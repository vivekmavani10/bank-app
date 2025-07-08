import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import { fetchAllTransactionsAdmin } from "../api/transactionsApi";
import PageContainer from "../components/PageContainer";

interface Transaction {
  transaction_id: string;
  sender_account: string;
  receiver_account: string;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
}

const AdminTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "transfer", label: "Transfer" },
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await fetchAllTransactionsAdmin(filterType);
        setTransactions(data || []);
      } catch (error: any) {
        console.error("Error fetching admin transactions:", error.message);
      }
    };

    fetchTransactions();
  }, [filterType]);

  return (
    <PageContainer
      title="All Transactions"
      actions={
        <Dropdown
          name="type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={typeOptions}
          className="w-full sm:w-56 border border-gray-300 rounded-full px-3 py-1 text-sm sm:mt-0"
        />
      }
    >
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[850px] text-sm text-gray-700 text-center">
          <thead className="bg-[#004466] text-white">
            <tr>
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Receiver</th>
              <th className="py-3 px-4">Amount (₹)</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-6 text-gray-500 italic">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((txn) => (
                <tr
                  key={txn.transaction_id}
                  className="hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    {txn.transaction_id}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {txn.sender_account || "-"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {txn.receiver_account || "-"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 whitespace-nowrap">
                    ₹{txn.amount}
                  </td>
                  <td className="py-3 px-4 capitalize whitespace-nowrap">
                    {txn.transaction_type}
                  </td>
                  <td className="py-3 px-4 capitalize whitespace-nowrap">
                    {txn.status || "-"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {new Date(txn.created_at).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </PageContainer>
  );
};

export default AdminTransaction;
