import { API } from "@/lib/endpoints";
import axiosInstance from "@/utils/api";

export const getFollowups = async (params) => {
  const res = await axiosInstance.get(API.FOLLOWUPS, { params });
  return res;
};
