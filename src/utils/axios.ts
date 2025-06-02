import axios, { AxiosInstance } from "axios";
import { useMemo } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAxios = (): { axiosInstance: AxiosInstance } => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: "Bearer " + localStorage.getItem("adminToken"),
      },
    });

    // Add interceptors if needed
    instance.interceptors.request.use(
      (config) => {
        // Example: attach token
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        // Global error handling (optional)
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  return { axiosInstance };
};
