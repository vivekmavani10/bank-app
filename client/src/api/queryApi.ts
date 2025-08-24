// src/api/queryApi.ts
import axiosInstance from "../services/axiosInstance";
import { toast } from "react-toastify";

export interface QueryPayload {
  query: string;
}

export interface QueryResponse {
  query_uuid: string;
  query: string;
  created_at: string;
  updated_at?: string;
  is_customer_read: boolean;
  is_admin_read: boolean;
  is_replied: boolean;
  reply?: string;
  repliedAt?: string;
}

export const getQueries = async (): Promise<QueryResponse[]> => {
  try {
    const { data } = await axiosInstance.get("/query");
    if (data.status === "success") {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch queries");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    toast.error(msg);
    throw new Error(msg);
  }
};

export const submitQuery = async (payload: QueryPayload): Promise<void> => {
  try {
    const { data } = await axiosInstance.post("/query", payload);
    if (data.status === "success") {
      toast.success(data.message);
    } else {
      throw new Error(data.message || "Failed to submit query");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    toast.error(msg);
    throw new Error(msg);
  }
};

export const updateQuery = async (
  query_uuid: string,
  payload: QueryPayload
): Promise<void> => {
  try {
    const { data } = await axiosInstance.put(`/query/${query_uuid}`, payload);
    if (data.status === "success") {
      toast.success(data.message);
    } else {
      throw new Error(data.message || "Failed to update query");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    toast.error(msg);
    throw new Error(msg);
  }
};

export const deleteQuery = async (query_uuid: string): Promise<void> => {
  try {
    const { data } = await axiosInstance.delete(`/query/${query_uuid}`);
    if (data.status === "success") {
      toast.success(data.message);
    } else {
      throw new Error(data.message || "Failed to delete query");
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message || error.message;
    toast.error(msg);
    throw new Error(msg);
  }
};
