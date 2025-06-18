import axiosInstance from "../services/axiosInstance";

interface LoginPayload {
  phone_number: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await axiosInstance.post("/login", payload);
  return response.data;
};
