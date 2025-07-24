import { WS_URL, BASE_PATH } from "@/lib/config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: WS_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const data = response.data;
    if (data.statusCode === 200 && data?.isSuccess == true) {
      return data;
    } else {
      if (data.statusCode === 433 || data.statusCode === 401) {
        localStorage.clear();
        window.location.href = `${BASE_PATH}`;
      } else {
        return Promise.reject(data);
      }
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      const { data } = response;
      if (data?.statusCode === 433 || data?.statusCode === 401) {
        localStorage.clear();
        window.location.href = `${BASE_PATH}`;
      } else {
        if (data) {
          return Promise.reject(data);
        } else {
          return Promise.reject({
            message: error?.message,
          });
        }
      }
    } else {
      return Promise.reject({
        message: "Network error try again",
      });
    }
  }
);

export default axiosInstance;
