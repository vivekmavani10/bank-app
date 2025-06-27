import axiosFormInstance from "../services/axiosFormInstance";

export interface ApplyAccountPayload {
  account_type: string;
  balance: number;
  aadhar_number: string;
  aadhar_file: File;
  pan_number: string;
  pan_file: File;
  nominee_name: string;
  nominee_relationship: string;
  address: string;
}

export const applyForAccount = async (payload: ApplyAccountPayload): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("account_type", payload.account_type);
    formData.append("balance", payload.balance.toString());
    formData.append("aadhar_number", payload.aadhar_number);
    formData.append("aadhar_file", payload.aadhar_file);
    formData.append("pan_number", payload.pan_number);
    formData.append("pan_file", payload.pan_file);
    formData.append("nominee_name", payload.nominee_name);
    formData.append("nominee_relationship", payload.nominee_relationship);
    formData.append("address", payload.address);

    const { data } = await axiosFormInstance.post("/account", formData);

    if (data?.status === "success") {
      return data.message;
    } else {
      throw new Error(data?.message || "Failed to apply for account");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong while submitting"
    );
  }
};