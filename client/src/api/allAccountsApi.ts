import axiosInstance from "../services/axiosInstance";

interface AllAccounts {
  full_name: string;
  phone_number: string;
  email?: string;
  account_number: string;
  account_type: string;
  balance: number;
  status: string;
}

interface AccountsResponse {
  accounts: AllAccounts[];
}

export const FetchAllAccounts = async (): Promise<AccountsResponse> => {
  const response = await axiosInstance.get<AccountsResponse>("/accounts");
  return response.data;
};
