import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { transactionHistory, downloadStatement } from "../api/transactionsApi";
import Button from "../components/Button";

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const transactionList = await transactionHistory();
        if (Array.isArray(transactionList)) {
          setTransactions(transactionList);
        } else {
          setTransactions([]);
          toast.info("No transactions found.");
        }
      } catch (error: any) {}
    };

    fetchTransactions();
  }, []);

  const handleDownloadStatement = async () => {
    try {
      const pdfBlob = await downloadStatement();
      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "KV Bank.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || "Download failed");
    }
  };

  return (
    <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-4 px-2 sm:px-4">
      <div className="w-full max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#004466] text-center sm:text-left">
            Transaction History
          </h1>
          <Button onClick={handleDownloadStatement}>Download Statement</Button>
        </div>

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
