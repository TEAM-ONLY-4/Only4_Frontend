import AdminLayout from "../../components/feature/adminLayout";
import { useEffect, useState } from "react";
import {
  getSettlementStatus,
  runSettlementBatch,
  SettlementStatusDto,
} from "../../api/settlementApi";
import { AxiosError } from "axios";

export default function Settlement() {
  const [status, setStatus] = useState<SettlementStatusDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 금액 포맷팅
  const formatAmount = (amount: number) => {
    const eok = Math.floor(amount / 100000000);
    const man = Math.floor((amount % 100000000) / 10000);
    if (eok > 0 && man > 0)
      return `${eok.toLocaleString()}억 ${man.toLocaleString()}만원`;
    if (eok > 0) return `${eok.toLocaleString()}억원`;
    if (man > 0) return `${man.toLocaleString()}만원`;
    return `${amount.toLocaleString()}원`;
  };

  // 날짜 포맷팅
  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr.replace(" ", "T"));

    if (isNaN(date.getTime())) return dateStr;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} ${hour}:${minute}`;
  };

  // 진행률 계산
  const calculateProgress = () => {
    if (!status || status.totalTargetCount === 0) return 0;
    const progress = (status.processedCount / status.totalTargetCount) * 100;
    return Math.min(Math.round(progress), 100);
  };

  // 조회
  const fetchStatus = async () => {
    try {
      const data = await getSettlementStatus();
      setStatus(data);
    } catch (error: any) {
      console.error("현황 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // 실행 핸들러
  const handleRunSettlement = async () => {
    if (status?.isCompleted || isLoading) return;
    if (!confirm("이번 달 정산을 실행하시겠습니까?")) return;

    setIsLoading(true);
    try {
      const message = await runSettlementBatch();
      alert(message);
    } catch (error: unknown) {
      const axiosError = error as AxiosError<any>;
      const errorData = axiosError.response?.data;
      if (errorData && errorData.reason) {
        alert(`실행 실패: ${errorData.reason}`);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      await fetchStatus();
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* 헤더 영역 */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">정산 관리</h1>
            <p className="mt-1 text-sm text-gray-500">
              월별 정산을 실행하고 정산 현황 및 결과를 확인합니다
            </p>
          </div>

          {/* 조건 없이 항상 우측 상단에 버튼 표시 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSettlement}
              disabled={status?.isCompleted || isLoading} // 완료되면 비활성화
              className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-2
                ${
                  status?.isCompleted || isLoading
                    ? "bg-gray-400 cursor-not-allowed" // 완료 시 회색
                    : "bg-teal-600 hover:bg-teal-700" // 실행 전 청록색
                }`}
            >
              {isLoading ? (
                <i className="ri-loader-4-line animate-spin"></i>
              ) : (
                <i className="ri-play-line"></i>
              )}
              정산 실행
            </button>
          </div>
        </div>
        {/* 컨텐츠 영역 */}
        <div
          className={`bg-white rounded-lg border border-gray-200 flex flex-col 
  ${!status?.lastExecutedAt ? "min-h-[400px]" : ""}`}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <i className="ri-file-list-3-line text-teal-600"></i>
              정산 실행 현황
            </h2>
          </div>

          <div className="flex-1 flex flex-col">
            {!status ? (
              // 1. 로딩 중
              <div className="flex-1 flex flex-col items-center justify-center">
                <i className="ri-loader-2-line text-4xl text-teal-600 animate-spin mb-4"></i>
                <p className="text-gray-500">데이터를 불러오는 중입니다...</p>
              </div>
            ) : !status.lastExecutedAt ? (
              // 2. 초기 화면
              <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <i className="ri-file-list-3-line text-3xl text-gray-400"></i>
                </div>
                <p className="text-lg font-bold text-gray-900 mb-2">
                  아직 실행된 정산이 없습니다
                </p>
                <p className="text-sm text-gray-500 text-center">
                  우측 상단의 '정산 실행' 버튼을 눌러 이번 달 정산을 시작하세요
                </p>
              </div>
            ) : (
              // 3. 결과 테이블
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        정산월
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        대상 건수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        정산 완료
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        진행률
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        총 청구 금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        정산 실행 일시
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {status.targetDate}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {status.totalTargetCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {status.processedCount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                            <div
                              className="h-full bg-teal-500 transition-all duration-500 ease-out"
                              style={{ width: `${calculateProgress()}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {calculateProgress()}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatAmount(status.totalAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatDateTime(status.lastExecutedAt)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
