import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  FetchAllAccounts,
  ApproveAccount,
  RejectAccount,
} from "../api/AdminAccountsApi";
import { toast } from "react-toastify";

const AllAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approve" },
    { value: "rejected", label: "Reject" },
  ];

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await FetchAllAccounts();
        setAccounts(response.accounts);
        setStatuses(response.accounts.map((acc: any) => acc.status || ""));
      } catch (error) {
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
      if (newStatus === "approved") {
        await ApproveAccount(accountUuid);
        toast.success("Account approved successfully!");
      }

      if (newStatus === "rejected") {
        await RejectAccount(accountUuid);
        toast.success("Account rejected successfully!");
      }

      const updatedStatuses = [...statuses];
      updatedStatuses[index] = newStatus;
      setStatuses(updatedStatuses);

      const updatedAccounts = [...accounts];
      updatedAccounts[index].status = newStatus;
      setAccounts(updatedAccounts);
    } catch (error: any) {
      console.error("Status update error:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
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
                    <tr key={index} className="border-t">
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
        </div>
      </div>
    </div>
  );
};

export default AllAccounts;
