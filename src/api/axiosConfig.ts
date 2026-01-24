// src/api/axiosConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 위에서 설정한 Proxy 경로를 탄다
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
