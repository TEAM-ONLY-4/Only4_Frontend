// src/api/dashboardApi.ts
import api from "./axiosConfig"; // 기존에 설정한 axios 인스턴스

// 백엔드 DTO와 일치하는 타입 정의
export interface DashboardStatsDto {
  totalMemberCount: number; // 총 가입자 수
  settlementCompletedCount: number; // 이번 달 정산 완료 건수
  sendWaitingCount: number; // 이번 달 발송 대기 건수
  emailSuccessCount: number; // 이메일 발송 성공 건수
  smsSuccessCount: number; // SMS 대체 발송 성공 건수
}

/**
 * 대시보드 통계 조회 (GET /api/admin/dashboard/stats)
 * @param date "yyyy-MM" (옵션, 없으면 현재 월)
 */
export const getDashboardStats = async (date?: string) => {
  const response = await api.get<DashboardStatsDto>("/admin/dashboard/stats", {
    params: { date },
  });
  return response.data;
};
