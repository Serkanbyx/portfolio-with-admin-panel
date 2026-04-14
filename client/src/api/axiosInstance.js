import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_URL
    : "/api";

const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelay: 1500,
  retryableStatuses: [500, 502, 503, 504],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableRequest = (config) =>
  config.method === "get" && !config._retryCount;

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const status = error.response?.status;
    const isTimeout = error.code === "ECONNABORTED";

    const shouldRetry =
      config &&
      (isRetryableRequest(config) || config._retryCount > 0) &&
      (RETRY_CONFIG.retryableStatuses.includes(status) || isTimeout);

    if (shouldRetry) {
      config._retryCount = (config._retryCount || 0) + 1;

      if (config._retryCount <= RETRY_CONFIG.maxRetries) {
        const delay = RETRY_CONFIG.baseDelay * config._retryCount;
        await sleep(delay);
        return axiosInstance(config);
      }
    }

    const { pathname } = window.location;
    if (status === 401 && pathname.startsWith("/admin") && pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }

    const message =
      error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  },
);

export default axiosInstance;
