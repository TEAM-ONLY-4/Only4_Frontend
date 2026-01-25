import api from "./axiosConfig";

// 백엔드 응답 타입 정의 (page.tsx에서 import하지 말고 여기서 정의하거나 별도 파일로 분리)
export interface ReservationResponseDto {
  id: number;
  targetBillingYearMonth: string;
  scheduledSendAt: string;
  status: string;
}

// 1. 데이터 조회 (GET)
export const getDashboardStatus = async () => {
  const response = await api.get("/v1/notifications/stats");
  return response.data;
};

export const getSchedules = async () => {
  // 제네릭 사용
  const response = await api.get<ReservationResponseDto[]>(
    "/v1/notifications/reservations",
  );

  return response.data.map((item) => ({
    id: item.id.toString(), // 프론트에서 id를 string으로 쓴다면 변환
    month: item.targetBillingYearMonth, // "2025-02"
    scheduledDate: item.scheduledSendAt, // "2026-01-24 14:00"
    status: item.status.toLowerCase(), // "scheduled"
    targetCount: 1000000,
  }));
};

// 2. 데이터 전송 (POST, PUT, DELETE)
export const sendUnsentBills = async () => {
  const response = await api.post("/v1/notifications/manual-send");
  return response.data;
};

export const createSchedule = async (data: any) => {
  console.log("createSchedule 호출됨, 데이터:", data); // 디버깅

  // 안전장치: 데이터가 제대로 안 넘어왔을 경우 방어
  if (!data.scheduledDate) {
    console.error("scheduledDate가 없습니다! page.tsx 변수명을 확인하세요.");
    throw new Error("예약 시간이 누락되었습니다.");
  }

  const payload = {
    // 프론트: "2025-02" -> 백엔드: "2025-02-01"
    targetBillingYearMonth: `${data.month}-01`,

    // 프론트: "2026-01-24 14:00" -> 백엔드: "2026-01-24T14:00:00"
    scheduledSendAt: data.scheduledDate.replace(" ", "T") + ":00",
  };

  const response = await api.post("/v1/notifications/reservations", payload);
  return response.data;
};

export const updateSchedule = async (id: string, data: any) => {
  if (!data.scheduledDate) {
    throw new Error("예약 시간이 누락되었습니다.");
  }

  const payload = {
    targetBillingYearMonth: `${data.month}-01`,
    scheduledSendAt: data.scheduledDate.replace(" ", "T") + ":00",
  };

  const response = await api.put(
    `/v1/notifications/reservations/${id}`,
    payload,
  );
  return response.data;
};

export const deleteSchedule = async (id: string) => {
  const response = await api.delete(`/v1/notifications/reservations/${id}`);
  return response.data;
};
