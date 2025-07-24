import { API } from "@/lib/endpoints";
import axiosInstance from "@/utils/api";

export const getAlerts = async (params) => {
  const res = await axiosInstance.get(API.ALERTS, { params });
  return res;
};
