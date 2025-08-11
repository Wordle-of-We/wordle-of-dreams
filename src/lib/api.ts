import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

interface RetriableConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type Prefix = 'admin' | 'user';

function createApi(prefix: Prefix): AxiosInstance {
  const api = axios.create({ baseURL: API_BASE_URL });

  let isRefreshing = false;
  type QueueItem = [(token: string) => void, (err: any) => void];
  let pendingQueue: QueueItem[] = [];

  const tokenKey = `${prefix}Token`;
  const refreshKey = `${prefix}RefreshToken`;
  const emailKey = `${prefix}Email`;

  function processQueue(error: any, token: string | null = null) {
    pendingQueue.forEach(([resolve, reject]) => {
      if (token) resolve(token);
      else reject(error);
    });
    pendingQueue = [];
  }

  api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(tokenKey);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as RetriableConfig | undefined;
      const status = error.response?.status;

      if (status === 401 && original && !original._retry && typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem(refreshKey);
        const email = localStorage.getItem(emailKey);

        if (!refreshToken || !email) {
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(refreshKey);
          localStorage.removeItem(emailKey);
          return Promise.reject(error);
        }

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            pendingQueue.push([
              (newToken: string) => {
                original.headers = original.headers || {};
                (original.headers as any).Authorization = `Bearer ${newToken}`;
                resolve(api(original));
              },
              reject,
            ]);
          });
        }

        original._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
            `${API_BASE_URL}/auth/refresh`,
            { email, refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          localStorage.setItem(tokenKey, data.accessToken);
          localStorage.setItem(refreshKey, data.refreshToken);

          processQueue(null, data.accessToken);

          original.headers = original.headers || {};
          (original.headers as any).Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem(tokenKey);
          localStorage.removeItem(refreshKey);
          localStorage.removeItem(emailKey);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const apiAdmin = createApi('admin');
export const apiUser = createApi('user');
