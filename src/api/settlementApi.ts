// src/api/settlementApi.ts
import api from "./axiosConfig";

// 1. 정산 현황 조회 응답 타입
export interface SettlementStatusDto {
  targetDate: string; // "2026-01"
  totalTargetCount: number; // 1000000
  processedCount: number; // 939209
  totalAmount: number; // 72369800000
  lastExecutedAt: string | null; // "2026-01-23T16:23:00" or null
  isCompleted: boolean; // true/false
}

// 2. 정산 실행 요청 타입 (선택 사항)
export interface SettlementRunRequest {
  targetDate?: string; // "2026-01" (없으면 현재 월)
}

// 3. 에러 응답 타입 (공통)
export interface ErrorResponseDto {
  success: boolean;
  message: string;
  status: number;
  code: string;
  reason: string;
  errors: any[];
}

// =================================================================

/**
 * 정산 현황 조회 (GET)
 * @param date "yyyy-MM" (옵션)
 */
export const getSettlementStatus = async (date?: string) => {
  // params로 쿼리 스트링 전달 (?date=2026-01)
  const response = await api.get<SettlementStatusDto>("/settlement/status", {
    params: { date },
  });
  return response.data;
};

/**
 * 정산 배치 실행 (POST)
 * @param date "yyyy-MM" (옵션)
 */
export const runSettlementBatch = async (date?: string) => {
  const payload = date ? { targetDate: date } : {};
  // 200 OK일 경우 단순 문자열 반환
  const response = await api.post<string>("/settlement/run", payload);
  return response.data;
};
