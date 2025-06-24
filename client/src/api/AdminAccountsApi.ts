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
  accounts: AllAccounts[];
}

// Fetch all accounts
export const FetchAllAccounts = async (): Promise<AccountsResponse> => {
  const response = await axiosInstance.get<AccountsResponse>("/accounts");
  return response.data;
};

// Approve account
export const ApproveAccount = async (accountUuid: string): Promise<void> => {
  await axiosInstance.put(`/account/approve/${accountUuid}`);
};

// Reject account
export const RejectAccount = async (accountUuid: string): Promise<void> => {
  await axiosInstance.put(`/account/reject/${accountUuid}`);
};
