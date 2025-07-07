import axiosInstance from "../services/axiosInstance";

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
  const { data } = await axiosInstance.get("/profile");
  if (data?.status === "success") {
    return data.data;
  } else {
    throw new Error(data?.message || "Failed to fetch profile");
  }
};

export const updateProfile = async (
  payload: UpdateProfilePayload
): Promise<{ message: string }> => {
  const { data } = await axiosInstance.put("/profile", payload);
  if (data?.status === "success") {
    return { message: data.message };
  } else {
    throw new Error(data?.message || "Profile update failed");
  }
};
