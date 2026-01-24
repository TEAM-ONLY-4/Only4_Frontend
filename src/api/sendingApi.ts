// src/api/sendingApi.ts
import api from "./axiosConfig"; // 아까 만든 axios 설정 파일 import

// 1. 데이터 조회 (GET)
export const getDashboardStatus = async () => {
  // 기존 fetch 코드 삭제됨
  const response = await api.get("/v1/notifications/stats");
  return response.data;
};

export const getSchedules = async () => {
  //   const response = await api.get("");
  //   return response.data;
  console.warn("예약 목록 API가 아직 없어서 빈 배열을 사용합니다.");
  return [];
};

export const getHistory = async (month: string) => {
  // 쿼리 파라미터(?month=...)도 axios는 params 옵션으로 깔끔하게 처리가능
  //   const response = await api.get("/sending/history", {
  //     params: { month },
  //   });
  //   return response.data;
  console.warn("예약 목록 API가 아직 없어서 빈 배열을 사용합니다.");
  return [];
};

// 2. 데이터 전송 (POST, PUT, DELETE)
export const sendUnsentBills = async () => {
  const response = await api.post("/v1/notifications/manual-send");
  return response.data;
};

export const createSchedule = async (data: any) => {
  //   const response = await api.post("/v1/notifications/manual-send", data);
  //   return response.data;
  console.warn("예약 목록 API가 아직 없어서 빈 배열을 사용합니다.");
  return [];
};

export const updateSchedule = async (id: string, data: any) => {
  //   const response = await api.put(`/sending/schedules/${id}`, data);
  //   return response.data;
  console.warn("예약 목록 API가 아직 없어서 빈 배열을 사용합니다.");
  return [];
};

export const deleteSchedule = async (id: string) => {
  //   const response = await api.delete(`/sending/schedules/${id}`);
  //   return response.data;
  console.warn("예약 목록 API가 아직 없어서 빈 배열을 사용합니다.");
  return [];
};
