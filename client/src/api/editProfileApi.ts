import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

export interface ProfileResponse {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
}

export interface UpdateProfilePayload {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
}

export const getProfile = async (): Promise<ProfileResponse> => {
  try {
    const { data } = await axiosInstance.get("/profile");
    if (data?.status === "success") {
      return data.data;
    } else {
      throw new Error(data?.message || "Failed to fetch profile");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message || "Something went wrong";
    toast.error(msg);
    throw new Error(msg);
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.put("/profile", payload);
    if (data?.status === "success") {
      toast.success(data.message || "Profile updated successfully");
      return { message: data.message };
    } else {
      throw new Error(data?.message || "Profile update failed");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message || "Something went wrong";
    toast.error(msg);
    throw new Error(msg);
  }
};
