import AdminLayout from "../../components/feature/adminLayout";
import { useState, useEffect } from "react";
// 1. 만들어둔 API 함수들을 가져옵니다. (axiosConfig 직접 사용 X)
import {
  getDashboardStatus,
  getSchedules,
  sendUnsentBills,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../api/sendingApi";

// 2. 타입 정의 (백엔드 DTO와 일치시킴)
export interface NotificationStatDto {
  billingMonth: string;
  publishCount: number;
  sendCount: number;
}
export interface Schedule {
  id: string; // 혹은 number (백엔드 맞춰서)
  month: string;
  scheduledDate: string;
  status: string;
  targetCount: number;
}

export default function Sending() {
  const [showUnsentModal, setShowUnsentModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  // 예약 관련 입력 State
  const [scheduledYear, setScheduledYear] = useState("2025");
  const [scheduledMonth, setScheduledMonth] = useState("02");
  const [scheduledDay, setScheduledDay] = useState("01");
  const [scheduledHour, setScheduledHour] = useState("09");
  const [scheduledMinute, setScheduledMinute] = useState("00");
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null,
  );

  // 3. 서버 데이터 State
  const [scheduledSendings, setScheduledSendings] = useState<Schedule[]>([]);
  const [sendingTargets, setSendingTargets] = useState<NotificationStatDto[]>(
    [],
  );

  // 4. 데이터 조회 함수 (API 함수 사용)
  const fetchDashboardData = async () => {
    try {
      // API 두 개를 병렬로 호출해서 데이터를 받아옴
      const [statsData, schedulesData] = await Promise.all([
        getDashboardStatus(),
        getSchedules(),
      ]);
      console.log("백엔드에서 받은 데이터:", statsData);

      setSendingTargets(statsData);
      setScheduledSendings(schedulesData);
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  // 5. 초기 실행
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 7. 미발송 발송 처리
  const handleUnsentSend = async () => {
    try {
      await sendUnsentBills(); // API 호출
      setShowUnsentModal(false);
      alert("미발송 청구서 발송이 시작되었습니다.");
      fetchDashboardData(); // 데이터 새로고침
    } catch (error) {
      console.error(error);
      alert("발송 요청 실패");
    }
  };

  // 8. 예약 발송 등록/수정
  const handleScheduleSend = async () => {
    const scheduledDate = `${scheduledYear}-${scheduledMonth}-${scheduledDay} ${scheduledHour}:${scheduledMinute}`;
    const month = `${scheduledYear}-${scheduledMonth}`;

    try {
      if (editingScheduleId) {
        // 수정 (PUT)
        await updateSchedule(editingScheduleId, { scheduledDate, month });
        alert(`예약이 ${scheduledDate}로 수정되었습니다.`);
      } else {
        // 신규 (POST)
        await createSchedule({
          scheduledDate,
          month,
          targetCount: 1000000,
        });
        alert(`${scheduledDate}에 발송이 예약되었습니다.`);
      }

      setShowScheduleModal(false);
      setEditingScheduleId(null);
      fetchDashboardData(); // 목록 새로고침
    } catch (error) {
      console.error(error);
      alert("발송 예정 시간은 미래여야 합니다.");
    }
  };

  // 9. 예약 취소
  const handleCancelSchedule = async (id: string, status: string) => {
    if (status === "completed") return;

    if (confirm("예약을 취소하시겠습니까?")) {
      try {
        await deleteSchedule(id); // API 호출
        alert("예약이 취소되었습니다.");
        await fetchDashboardData(); // 목록 새로고침
      } catch (error) {
        console.error(error);
        alert("취소 실패");
      }
    }
  };

  // 모달 열기 헬퍼 함수들 (기존 로직 유지)
  const handleEditSchedule = (schedule: Schedule) => {
    if (schedule.status === "completed") return;

    const [datePart, timePart] = schedule.scheduledDate.split(" ");
    const [year, month, day] = datePart.split("-");
    const [hour, minute] = timePart.split(":");

    setScheduledYear(year);
    setScheduledMonth(month);
    setScheduledDay(day);
    setScheduledHour(hour);
    setScheduledMinute(minute);
    setEditingScheduleId(schedule.id);
    setShowScheduleModal(true);
  };

  const openNewScheduleModal = () => {
    setScheduledYear("2025");
    setScheduledMonth("02");
    setScheduledDay("01");
    setScheduledHour("09");
    setScheduledMinute("00");
    setEditingScheduleId(null);
    setShowScheduleModal(true);
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <span className="text-blue-600 font-bold">예약됨</span>;
      case "done":
        return <span className="text-green-600 font-bold">발송 완료</span>;
      case "failed":
        return <span className="text-red-600 font-bold">실패됨</span>; // 🔴 여기!
      case "cancelled":
        return <span className="text-gray-400">취소됨</span>;
      default:
        return <span>{status}</span>;
    }
  };
  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">발송 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              정산 완료 건에 대한 발송을 실행하고 발송 결과를 확인합니다
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={openNewScheduleModal}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <i className="ri-calendar-line"></i>
              예약 발송
            </button>
            <button
              onClick={() => setShowUnsentModal(true)}
              className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
            >
              <i className="ri-mail-send-line"></i>
              미발송 청구서 발송
            </button>
          </div>
        </div>

        {/* 발송 실행 현황 */}
        <div className="bg-white rounded-lg border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i className="ri-send-plane-line text-teal-600"></i>
              발송 실행 현황
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    정산월
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    발송시도
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    발송완료
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sendingTargets.map((item, index) => {
                  // status가 없으므로 직접 계산
                  // (참고: 백엔드에서 status도 보내주면 그걸 쓰는게 좋습니다)
                  const isCompleted =
                    item.publishCount > 0 &&
                    item.publishCount === item.sendCount;

                  return (
                    <tr
                      key={index}
                      onClick={() =>
                        setSelectedRow(
                          selectedRow === item.billingMonth
                            ? null
                            : item.billingMonth,
                        )
                      }
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {item.billingMonth}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-orange-600">
                          {item.publishCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-green-600">
                          {item.sendCount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 예약된 발송 */}
        {scheduledSendings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <i className="ri-calendar-check-line text-purple-600"></i>
                예약된 발송
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      정산월
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      예약 일시
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scheduledSendings.map((schedule) => {
                    const isCompleted = schedule.status === "completed";
                    return (
                      <tr
                        key={schedule.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">
                            {schedule.month}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {schedule.scheduledDate}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isCompleted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="ri-check-line mr-1"></i>
                              실행 완료
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <i className="ri-time-line mr-1"></i>
                              {getStatusBadge(schedule.status)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {schedule.status === "scheduled" && (
                              <button
                                onClick={() => handleEditSchedule(schedule)}
                                disabled={isCompleted}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                  isCompleted
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-gray-700 hover:bg-gray-100 cursor-pointer"
                                }`}
                              >
                                <i className="ri-edit-line mr-1"></i>
                                수정
                              </button>
                            )}
                            {schedule.status === "scheduled" && (
                              <button
                                onClick={() =>
                                  handleCancelSchedule(
                                    schedule.id,
                                    schedule.status,
                                  )
                                }
                                disabled={isCompleted}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                  isCompleted
                                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                    : "text-red-600 hover:bg-red-50 cursor-pointer"
                                }`}
                              >
                                <i className="ri-close-circle-line mr-1"></i>
                                취소
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Unsent Modal */}
        {showUnsentModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  미발송 청구서 발송
                </h3>
                <button
                  onClick={() => setShowUnsentModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <i className="ri-information-line text-blue-600 text-lg mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      발송 확인
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      미발송된 청구서에 대해 즉시 발송을 시작합니다.
                      계속하시겠습니까?
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUnsentModal(false)}
                  className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleUnsentSend}
                  className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  발송 시작
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingScheduleId ? "예약 수정" : "예약 발송"}
                </h3>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setEditingScheduleId(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      년
                    </label>
                    <select
                      value={scheduledYear}
                      onChange={(e) => setScheduledYear(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      월
                    </label>
                    <select
                      value={scheduledMonth}
                      onChange={(e) => setScheduledMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = String(i + 1).padStart(2, "0");
                        return (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      일
                    </label>
                    <select
                      value={scheduledDay}
                      onChange={(e) => setScheduledDay(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = String(i + 1).padStart(2, "0");
                        return (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      시
                    </label>
                    <select
                      value={scheduledHour}
                      onChange={(e) => setScheduledHour(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = String(i).padStart(2, "0");
                        return (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      분
                    </label>
                    <select
                      value={scheduledMinute}
                      onChange={(e) => setScheduledMinute(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {["00"].map((min) => (
                        <option key={min} value={min}>
                          {min}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <i className="ri-information-line text-purple-600 text-lg mt-0.5"></i>
                  <div>
                    <p className="text-sm font-medium text-purple-900">
                      {editingScheduleId ? "예약 수정 안내" : "예약 발송 안내"}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      {editingScheduleId
                        ? "선택한 시간으로 예약이 변경됩니다."
                        : "선택한 시간에 자동으로 발송이 시작됩니다."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setEditingScheduleId(null);
                  }}
                  className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  취소
                </button>
                <button
                  onClick={handleScheduleSend}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {editingScheduleId ? "수정 완료" : "예약 설정"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
