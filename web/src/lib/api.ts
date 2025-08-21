import axios from "axios";
const base = (import.meta.env.VITE_API_URL ?? "http://localhost:4000") + "/api";
export const api = axios.create({ baseURL: base });

export function setToken(token?: string) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("accessToken", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("accessToken");
  }
}

// восстановить при перезагрузке
const saved = localStorage.getItem("accessToken");
if (saved) setToken(saved);