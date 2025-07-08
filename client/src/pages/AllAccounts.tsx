import React, { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import {
  FetchAllAccounts,
  ApproveAccount,
  RejectAccount,
  DeleteAccount,
} from "../api/adminAccountsApi";
import { toast } from "react-toastify";
import Card from "../components/Card";
import { Trash2 } from "lucide-react";
import SearchInput from "../components/SearchInput";
import PageContainer from "../components/PageContainer";
import Popup from "../components/Popup";

const AllAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

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
    <PageContainer
      title="All Accounts"
      actions={
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Account Number"
          className="w-full sm:w-64"
        />
      }
    >
      <div className="w-full overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[900px] sm:min-w-full text-sm text-gray-700 text-center">
          <thead className="bg-[#004466] text-white">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Account</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Balance (₹)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Delete</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 text-center text-gray-500 italic"
                >
                  No accounts found
                </td>
              </tr>
            ) : (
              accounts.map((account, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => setSelectedAccount(account)}
                >
                  <td className="py-3 px-4 font-medium capitalize whitespace-nowrap">
                    {account.full_name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {account.phone_number}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {account.email || "N/A"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {account.account_number}
                  </td>
                  <td className="py-3 px-4 capitalize whitespace-nowrap">
                    {account.account_type}
                  </td>
                  <td className="py-3 px-4 font-semibold text-green-600 whitespace-nowrap">
                    ₹{account.balance}
                  </td>
                  <td className="py-3 whitespace-nowrap">
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
                      className="w-28 sm:w-32 md:w-40 rounded-full px-2 py-1 text-sm border border-gray-300"
                    />
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAccountToDelete(account.account_uuid);
                        setShowDeletePopup(true);
                      }}
                      className="text-gray-600 hover:text-red-600 transition-transform transform hover:scale-125 duration-200 ease-in-out"
                      title="Delete Account"
                    >
                      <Trash2
                        size={22}
                        className="transition duration-200 ease-in-out"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Card Modal */}
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

      {/* Delete Confirmation Popup */}
      {showDeletePopup && accountToDelete && (
        <Popup
          title="Confirm Delete"
          message="Are you sure you want to delete this account? This action cannot be undone."
          onConfirm={async () => {
            try {
              const message = await DeleteAccount(accountToDelete);
              toast.success(message);

              setAccounts((prev) =>
                prev.filter((acc) => acc.account_uuid !== accountToDelete)
              );
              setStatuses((prev, idx = -1) =>
                accounts
                  .filter((acc) => acc.account_uuid !== accountToDelete)
                  .map((acc) => acc.status)
              );
            } catch (error: any) {
              toast.error(error.message || "Failed to delete account");
            } finally {
              setShowDeletePopup(false);
              setAccountToDelete(null);
            }
          }}
          onCancel={() => {
            setShowDeletePopup(false);
            setAccountToDelete(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default AllAccounts;
