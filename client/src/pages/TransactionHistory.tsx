import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  // Optional: Fetch transactions with useEffect if needed

  return (
    <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-4 px-2 sm:px-4">
      <div className="w-full max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-[#004466] mb-6 sm:mb-8">
          Transaction History
        </h1>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-sm text-gray-700 text-center">
            <thead className="bg-[#004466] text-white">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">From</th>
                <th className="py-3 px-4">To</th>
                <th className="py-3 px-4">Amount (₹)</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-6 text-center text-gray-500 italic"
                  >
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
                      {txn.from_account_number || "-"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {txn.to_account_number || "-"}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-600 whitespace-nowrap">
                      ₹{txn.amount}
                    </td>
                    <td className="py-3 px-4 capitalize whitespace-nowrap">
                      {txn.transaction_type}
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
      </div>
    </div>
  );
};

export default TransactionHistory;
