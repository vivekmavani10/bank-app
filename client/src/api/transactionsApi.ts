import axiosInstance from "../services/axiosInstance";

export interface DepositPayload {
    account_number: string;
    balance: number;
    description: string;
}

export interface TransferPayload {
  receiver_account: string;
  amount: number;
  description: string;
}

export const depositMoney = async (payload: DepositPayload) => {
  try {
    const { data } = await axiosInstance.post("/deposit", payload);
    if (data?.status === "success") {
      return data.data;
    } else {
      throw new Error(data?.message || "Deposit Failed!");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

export const transactionHistory = async () => {
  try {
    const { data } = await axiosInstance.get("/transactions")
    if (data?.status === "success") {
      return data.data;
    } else {
      throw new Error(data?.message || "Transaction History failded to load!");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    )
  }
}

export const downloadStatement = async (): Promise<Blob> => {
  try {
    const response = await axiosInstance.get("/statement", {
      responseType: "blob",
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Failed to download statement"
    );
  }
};

export const transferMoney = async (payload: TransferPayload) => {
  try {
    const { data } = await axiosInstance.post("/transfer", payload);

    if (data?.status === "success") {
      return data.data;
    } else {
      throw new Error(data?.message || "Transfer failed!");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

export const fetchAllTransactionsAdmin = async (type: string = "all") => {
  try {
    const { data } = await axiosInstance.get(`/transaction?type=${type}`);
    if (data?.status === "success") {
      return data.data;
    } else {
      throw new Error(data?.message || "Failed to load admin transactions");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};

