import React, { useEffect, useState, useRef, useCallback } from "react";
import Dropdown from "../components/Dropdown";
import {
  FetchAllAccounts,
  ApproveAccount,
  RejectAccount,
  DeleteAccount,
} from "../api/adminAccountsApi";
import { toast } from "react-toastify";
import Card from "../components/Card";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import SearchInput from "../components/SearchInput";
import PageContainer from "../components/PageContainer";
import Popup from "../components/Popup";

const AllAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const limit = 7; // Items per page

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approve" },
    { value: "rejected", label: "Reject" },
  ];

  const fetchAccounts = useCallback(
    async (page: number, search: string = "") => {
      setIsLoading(true);
      try {
        const response = await FetchAllAccounts(search, page, limit);

        if (Array.isArray(response)) {
          setAccounts(response);
          setStatuses(response.map((acc: any) => acc.status || ""));
          setHasMore(response.length === limit);
          if (response.length === 0 && page === 1) {
            toast.info("No accounts found.");
          }
        } else {
          setAccounts([]);
          setStatuses([]);
          setHasMore(false);
          if (page === 1) {
            toast.info("No accounts found.");
          }
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to load accounts");
        console.error("Error fetching accounts:", error);
        setAccounts([]);
        setStatuses([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchAccounts(1, searchTerm);
  }, [searchTerm, fetchAccounts]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && (hasMore || newPage <= currentPage) && !isLoading) {
        setCurrentPage(newPage);
        fetchAccounts(newPage, searchTerm);

        // Scroll to top of table smoothly
        if (tableContainerRef.current) {
          tableContainerRef.current.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }
      }
    },
    [hasMore, currentPage, isLoading, searchTerm, fetchAccounts]
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;
      if (scrollPercentage >= 95 && hasMore && !isLoading) {
        handlePageChange(currentPage + 1);
      } else if (scrollPercentage <= 5 && currentPage > 1 && !isLoading) {
        handlePageChange(currentPage - 1);
      }
    },
    [currentPage, hasMore, isLoading, handlePageChange]
  );

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
        <div className="flex items-center space-x-4">
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Account Number"
            className="w-full sm:w-64"
          />

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Previous Page"
            >
              <ChevronUp size={16} />
            </button>

            <span className="text-sm font-medium min-w-[60px] text-center">
              Page {currentPage}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasMore || isLoading}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Next Page"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      }
    >
      <div className="relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        <div
          ref={tableContainerRef}
          className="w-full overflow-x-auto rounded-xl border border-gray-200 max-h-[500px] overflow-y-auto scroll-smooth"
          onScroll={handleScroll}
        >
          <table className="w-full min-w-[900px] sm:min-w-full text-sm text-gray-700 text-center">
            <thead className="bg-[#004466] text-white sticky top-0 z-5">
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
              {accounts.length === 0 && !isLoading ? (
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
                    key={`${account.account_uuid}-${currentPage}`}
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

        {/* Scroll Indicator */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <div className="flex space-x-1"></div>
          </div>

          <div className="text-sm text-gray-600">
            Page {currentPage} • Showing {accounts.length} of 7 items per page
          </div>
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
