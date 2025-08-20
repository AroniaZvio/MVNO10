import axios from "axios";
export const api = axios.create({ baseURL: "http://localhost:4000/api" });
export function setToken(token?: string) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}