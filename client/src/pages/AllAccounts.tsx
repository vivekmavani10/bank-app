import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  FetchAllAccounts,
  ApproveAccount,
  RejectAccount,
} from "../api/adminAccountsApi";
import { toast } from "react-toastify";
import Card from "../components/Card";

const AllAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approve" },
    { value: "rejected", label: "Reject" },
  ];

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsList = await FetchAllAccounts();
        if (Array.isArray(accountsList)) {
          setAccounts(accountsList);
          setStatuses(accountsList.map((acc: any) => acc.status || ""));
        } else {
          setAccounts([]);
          setStatuses([]);
          toast.info("No accounts found.");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load accounts");
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleStatusChange = async (
    index: number,
    newStatus: string,
    accountUuid: string
  ) => {
    try {
      let message = "";

      if (newStatus === "approved") {
        message = await ApproveAccount(accountUuid);
        toast.success(message);
      } else if (newStatus === "rejected") {
        message = await RejectAccount(accountUuid);
        toast.success(message);
      }

      const updatedStatuses = [...statuses];
      updatedStatuses[index] = newStatus;
      setStatuses(updatedStatuses);

      const updatedAccounts = [...accounts];
      updatedAccounts[index].status = newStatus;
      setAccounts(updatedAccounts);
    } catch (error: any) {
      console.error("Status update error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(97vh-90px)] bg-gradient-to-br from-gray-100 to-white py-4 px-4">
      <div className="max-w-8xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-[#004466] mb-8">
          Manage All Bank Accounts
        </h1>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full text-sm text-gray-700 text-center">
            <thead className="bg-[#004466] text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Balance (₹)</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 scrol">
              {accounts.map((account, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setSelectedAccount(account)}
                >
                  <td className="py-3 px-4 font-medium">{account.full_name}</td>
                  <td className="py-3 px-4">{account.phone_number}</td>
                  <td className="py-3 px-4">{account.email || "N/A"}</td>
                  <td className="py-3 px-4">{account.account_number}</td>
                  <td className="py-3 px-4 capitalize">{account.account_type}</td>
                  <td className="py-3 px-4 font-semibold text-green-600">
                    ₹{account.balance}
                  </td>
                  <td className="py-3 px-4">
                    <Dropdown
                      label=""
                      name="status"
                      value={statuses[index] || ""}
                      onChange={(e) =>
                        handleStatusChange(
                          index,
                          e.target.value,
                          account.account_uuid
                        )
                      }
                      options={statusOptions}
                      placeholder="Pending"
                      className="w-32 rounded-full px-2 py-1 text-sm border border-gray-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAccount && (
          <Card
            account={selectedAccount}
            onClose={() => setSelectedAccount(null)}
            onStatusUpdate={(newStatus: string) => {
              const updated = [...accounts];
              const idx = updated.findIndex(
                (acc) => acc.account_uuid === selectedAccount.account_uuid
              );
              if (idx !== -1) {
                updated[idx].status = newStatus;
                setAccounts(updated);

                const updatedStatuses = [...statuses];
                updatedStatuses[idx] = newStatus;
                setStatuses(updatedStatuses);
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AllAccounts;
