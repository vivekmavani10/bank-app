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
  try {
    const { data } = await axiosInstance.post("/login", payload);

    if (data?.status === "success" && data?.data?.token) {
      return {
        token: data.data.token,
        message: data.message,
        data: data.data.user,
      };
    } else {
      throw new Error(data?.message || "Login failed");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Something went wrong during login"
    );
  }
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<{ message: string }> => {
  try {
    const { data } = await axiosInstance.post("/register", payload);

    if (data?.status === "success") {
      return { message: data.message };
    } else {
      throw new Error(data?.message || "Registration failed");
    }
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error.message ||
        "Something went wrong during registration"
    );
  }
};
