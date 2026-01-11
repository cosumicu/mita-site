import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

const REFRESH_URL = "/auth/jwt/refresh/";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  withCredentials: true,
});

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// Handle queued requests after refresh
const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  failedQueue = [];
};

// Interceptor for handling 401 errors and refreshing tokens
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== REFRESH_URL
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Attempt to refresh token (via HttpOnly cookie)
        await api.post(REFRESH_URL, {}, { withCredentials: true });
        isRefreshing = false;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError as AxiosError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
