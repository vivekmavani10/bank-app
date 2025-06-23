import axiosFormInstance from "../services/axiosFormInstance";

interface ApplyAccountPayload {
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

export const applyForAccount = async (payload: ApplyAccountPayload) => {
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

  const response = await axiosFormInstance.post("/account", formData);
  return response.data;
};
