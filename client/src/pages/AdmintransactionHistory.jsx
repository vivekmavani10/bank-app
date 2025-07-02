import React, { useEffect ,useState } from "react";
import Dropdown from "../components/Dropdown";
import { fetchAllTransactionsAdmin } from "../api/transactionsApi";

const AdminTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("all");

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
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching admin transactions:", error.message);
      }
    };

    fetchTransactions();
  }, [filterType]);

  return (
   <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-4 px-2 sm:px-4">
      <div className="w-full max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#004466] text-center sm:text-left">
            All Transactions
          </h1>
          <Dropdown
            name="type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={typeOptions}
            className="w-40 border border-gray-300 rounded-full px-3 py-1 text-sm"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[700px] text-sm text-gray-700 text-center">
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
                transactions.map((txn, index) => (
                  <tr
                    key={txn.transaction_id || index}
                    className="hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{txn.transaction_id}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{txn.sender_account || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{txn.receiver_account || "-"}</td>
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
      </div>
    </div>
  );
};

export default AdminTransaction;
