import axiosInstance from "../services/axiosInstance";

interface LoginPayload {
  phone_number: string;
  password: string;
}

interface RegisterPayload {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await axiosInstance.post("/login", payload);
  return response.data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const response = await axiosInstance.post("/register", payload);
  return response.data;
};