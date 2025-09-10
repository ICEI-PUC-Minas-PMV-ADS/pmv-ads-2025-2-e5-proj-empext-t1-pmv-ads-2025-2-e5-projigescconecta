import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  withCredentials: true 
});

api.interceptors.response.use(
  res => res,
  err => {
    // tratamento de 401, refresh token, etc.
    return Promise.reject(err);
  }
);

export default api;
