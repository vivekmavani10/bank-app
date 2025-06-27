import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  FetchAllAccounts,
  ApproveAccount,
  RejectAccount,
} from "../api/AdminAccountsApi";
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-8xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-[#004466]">
            All Bank Accounts
          </h1>

          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              <table className="table-auto w-full border border-gray-300 text-base text-center">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Account</th>
                    <th className="px-4 py-2">Type</th>
                    <th className="px-4 py-2">Balance (₹)</th>
                    <th className="px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account, index) => (
                    <tr
                      key={index}
                      className="border-t cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedAccount(account)}
                    >
                      <td className="px-4 py-2">{account.full_name}</td>
                      <td className="px-4 py-2">{account.phone_number}</td>
                      <td className="px-4 py-2">{account.email || "N/A"}</td>
                      <td className="px-4 py-2">{account.account_number}</td>
                      <td className="px-4 py-2">{account.account_type}</td>
                      <td className="px-4 py-2">₹{account.balance}</td>
                      <td className="px-4 py-2">
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
                          className={`w-32 rounded-full px-2 py-1 text-black`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
    </div>
  );
};

export default AllAccounts;
