import axiosInstance from "../services/axiosInstance";

interface AllAccounts {
  full_name: string;
  phone_number: string;
  email?: string;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
  account_uuid: string;
}

interface AccountsResponse {
  status: string;
  message: string;
  data: AllAccounts[]; 
}

// Fetch all accounts
export const FetchAllAccounts = async (): Promise<AllAccounts[]> => {
  const response = await axiosInstance.get("/accounts");

  if (response.data.status === "success") {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch accounts");
  }
};

// Approve account
export const ApproveAccount = async (accountUuid: string): Promise<string> => {
  const response = await axiosInstance.put(`/account/approve/${accountUuid}`);
  if (response.data.status === "success") {
    return response.data.message;
  } else {
    throw new Error(response.data.message || "Failed to approve account");
  }
};

// Reject account
export const RejectAccount = async (accountUuid: string): Promise<string> => {
  const response = await axiosInstance.put(`/account/reject/${accountUuid}`);
  if (response.data.status === "success") {
    return response.data.message;
  } else {
    throw new Error(response.data.message || "Failed to reject account");
  }
};
