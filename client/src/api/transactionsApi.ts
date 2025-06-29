import axiosInstance from "../services/axiosInstance";

export interface DepositPayload {
    account_number: string;
    balance: number;
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