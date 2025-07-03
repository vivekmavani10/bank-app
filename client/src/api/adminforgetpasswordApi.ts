import axiosInstance from "../services/axiosInstance";

export interface AdminForgotPasswordPayload {
  phone_number: string;
  new_password: string;
  confirm_password: string;
}

export const resetPasswordByAdmin = async (
  payload: AdminForgotPasswordPayload
): Promise<void> => {
  try {
    const { data } = await axiosInstance.put("/updatePasswordByAdmin", payload);

    if (data?.status !== "success") {
      throw new Error(data?.message || "Password update failed");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};
