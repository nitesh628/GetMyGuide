// lib/service/api.ts
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number; 
  page?: number; 
  total?: number;
  totalPages?: number; 
}

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL ,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json", // Default JSON
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data as ApiResponse;
  },
  (error: AxiosError) => {
    if (error.response) {
      const errorData = error.response.data as ApiResponse;

      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          const publicRoutes = [
            "/",
            "/login",
            "/register",
            "/about",
            "/contact",
            "/services",
          ];
          const isPublicRoute = publicRoutes.some(
            (route) =>
              currentPath === route || currentPath.startsWith("/public")
          );

          if (!isPublicRoute && !currentPath.includes("/login")) {
            window.location.href =
              "/login?message=Please login to access this page";
          }
        }
      }

      return Promise.reject(
        errorData || { success: false, message: "Server error" }
      );
    } else if (error.request) {
      return Promise.reject({
        success: false,
        message: "No response from server",
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || "Request failed",
      });
    }
  }
);

export const apiService = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.get(url, config),

  post: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.post(url, data, config),

  put: <T = any>(
    url:string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.put(url, data, config),

  delete: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.delete(url, config),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => apiClient.patch(url, data, config),
};