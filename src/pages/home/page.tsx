import AdminLayout from "../../components/feature/adminLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardStatsDto, getDashboardStats } from "../../api/dashboardApi";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 현재 년월 가져오기
  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}년 ${month}월`;
  };

  // 숫자 포맷팅 (예: 1000000 -> 1,000,000)
  const formatNumber = (num: number | undefined) => {
    return num !== undefined ? num.toLocaleString() : "-";
  };

  // 퍼센트 계산 함수 (분자 / 분모 * 100)
  const calculatePercentage = (numerator: number, denominator: number) => {
    if (!denominator || denominator === 0) return "0.0";
    return ((numerator / denominator) * 100).toFixed(1);
  };

  // 데이터 조회
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("대시보드 데이터 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 카드 클릭 핸들러
  const handleCardClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
  };

  // 상단 KPI 카드 데이터 매핑
  const topKpiCards = [
    {
      label: "총 가입자 수",
      value: formatNumber(stats?.totalMemberCount),
      icon: "ri-user-line",
      color: "bg-blue-50 text-blue-600",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      label: "이번 달 정산 완료 건수",
      value: formatNumber(stats?.settlementCompletedCount),
      icon: "ri-checkbox-circle-line",
      color: "bg-green-50 text-green-600",
      gradient: "from-green-500 to-green-600",
      link: "/settlement",
    },
    {
      label: "이번 달 발송 대기 건수",
      value: formatNumber(stats?.sendWaitingCount),
      icon: "ri-time-line",
      color: "bg-orange-50 text-orange-600",
      gradient: "from-orange-500 to-orange-600",
      link: "/sending",
    },
  ];

  // 하단 KPI 카드 데이터 매핑 (이메일/SMS 성공률 계산)
  // 기준값: 정산 완료 건수 (청구서 생성 건수)라고 가정
  const baseCount = stats?.settlementCompletedCount || 0;

  const bottomKpiCards = [
    {
      label: "이메일 발송 성공률",
      value: `${formatNumber(stats?.emailSuccessCount)}건`,
      subValue: `(${calculatePercentage(stats?.emailSuccessCount || 0, baseCount)}%)`,
      subValueColor: "text-teal-600",
      icon: "ri-mail-check-line",
      color: "bg-teal-50 text-teal-600",
      gradient: "from-teal-500 to-teal-600",
      link: "/sending",
    },
    {
      label: "SMS 대체 발송",
      value: `${formatNumber(stats?.smsSuccessCount)}건`,
      subValue: `(${calculatePercentage(stats?.smsSuccessCount || 0, baseCount)}%)`,
      subValueColor: "text-pink-600",
      icon: "ri-message-3-line",
      color: "bg-pink-50 text-pink-600",
      gradient: "from-pink-500 to-pink-600",
      link: "/sending",
    },
  ];

  return (
    <AdminLayout>
      <div className="p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-3">
            <h1 className="text-4xl font-bold text-gray-900">
              관리자 대시보드
            </h1>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-full shadow-md">
              <i className="ri-calendar-line text-base"></i>
              {getCurrentMonth()}
            </span>
          </div>
          <p className="text-base text-gray-500">
            시스템 전체 현황을 한눈에 확인하세요
          </p>
        </div>

        {isLoading ? (
          // 로딩 중 UI
          <div className="flex justify-center items-center py-20">
            <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          </div>
        ) : (
          <>
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {topKpiCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(card.link)}
                  className={`bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${card.link ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity`}
                  ></div>
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-20 h-20 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <i className={`${card.icon} text-4xl`}></i>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 font-semibold">
                      {card.label}
                    </p>
                    <div>
                      <p className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                        {card.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {bottomKpiCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() => handleCardClick(card.link)}
                  className={`bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${card.link ? "cursor-pointer" : ""}`}
                >
                  <div
                    className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity`}
                  ></div>
                  <div className="flex flex-col items-center text-center relative z-10">
                    <div
                      className={`w-20 h-20 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <i className={`${card.icon} text-4xl`}></i>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 font-semibold">
                      {card.label}
                    </p>
                    <div>
                      <p className="text-3xl font-bold text-gray-900 whitespace-nowrap">
                        {card.value}
                      </p>
                      {card.subValue && (
                        <p
                          className={`text-xl font-semibold ${card.subValueColor || "text-gray-600"} mt-1`}
                        >
                          {card.subValue}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
