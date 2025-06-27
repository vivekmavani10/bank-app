import axiosInstance from "../services/axiosInstance";

export const getDashboardData = async () => {
  try {
    const { data } = await axiosInstance.get("/dashboard");
    if (data?.status === "success") {
      return data.data; // Only return useful data
    } else {
      throw new Error(data?.message || "Unexpected error");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
  }
};