import { getLocalStorage, setLocalStorage } from '@/utils/helpers/helpers';
import axios from 'axios';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateAPI = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**Request Interceptor */
privateAPI.interceptors.request.use(
  (config) => {
    const token = getLocalStorage('_at');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

/**Response Interceptor */
privateAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  function (error) {
    const originalRequest = error.config;

    if (
      error?.response &&
      error?.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = getLocalStorage('_rt');
      return axios
        .post(`${import.meta.env.VITE_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })
        .then((res) => {
          if (res.status === 200) {
            setLocalStorage({ key: '_at', value: res.data.access });
            privateAPI.defaults.headers.common['Authorization'] =
              'Bearer ' + res.data.access;
            originalRequest.headers['Authorization'] =
              `Bearer ${res.data.access}`;
            return privateAPI(originalRequest);
          }
        });
    }
    return Promise.reject(error);
  }
);
