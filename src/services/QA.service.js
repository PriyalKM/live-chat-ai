import { API } from "@/lib/endpoints";
import axiosInstance from "@/utils/api";

export const getQAList = async (params) => {
  const res = await axiosInstance.get(API.QA, { params });
  return res;
};
