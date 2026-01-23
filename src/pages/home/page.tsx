import AdminLayout from '../../components/feature/AdminLayout';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const topKpiCards = [
        { label: '총 가입자 수', value: '1,000,000', icon: 'ri-user-line', color: 'bg-blue-50 text-blue-600', gradient: 'from-blue-500 to-blue-600' },
        { label: '이번 달 정산 완료 건수', value: '980,000', icon: 'ri-checkbox-circle-line', color: 'bg-green-50 text-green-600', gradient: 'from-green-500 to-green-600', link: '/settlement' },
        { label: '이번 달 발송 대기 건수', value: '980,000', icon: 'ri-time-line', color: 'bg-orange-50 text-orange-600', gradient: 'from-orange-500 to-orange-600', link: '/sending' },
    ];

    const bottomKpiCards = [
        { label: '이메일 발송 성공률', value: '971,180건', subValue: '(99.1%)', subValueColor: 'text-teal-600', icon: 'ri-mail-check-line', color: 'bg-teal-50 text-teal-600', gradient: 'from-teal-500 to-teal-600', link: '/sending' },
        { label: 'SMS 대체 발송', value: '9,800건', subValue: '(1.0%)', subValueColor: 'text-pink-600', icon: 'ri-message-3-line', color: 'bg-pink-50 text-pink-600', gradient: 'from-pink-500 to-pink-600', link: '/sending' },
    ];

    const handleCardClick = (link?: string) => {
        if (link) {
            navigate(link);
        }
    };

    // Get current month
    const getCurrentMonth = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        return `${year}년 ${month}월`;
    };

    try {
        return (
            <AdminLayout>
                <div className="p-8 bg-gray-50 min-h-screen">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-3">
                            <h1 className="text-4xl font-bold text-gray-900">관리자 대시보드</h1>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-semibold rounded-full shadow-md">
                <i className="ri-calendar-line text-base"></i>
                                {getCurrentMonth()}
              </span>
                        </div>
                        <p className="text-base text-gray-500">시스템 전체 현황을 한눈에 확인하세요</p>
                    </div>

                    {/* Top KPI Cards - 3 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {topKpiCards && topKpiCards.length > 0 ? (
                            topKpiCards.map((card, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(card.link)}
                                    className={`bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${card.link ? 'cursor-pointer' : ''}`}
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity`}></div>
                                    <div className="flex flex-col items-center text-center relative z-10">
                                        <div className={`w-20 h-20 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <i className={`${card.icon} text-4xl`}></i>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">{card.label}</p>
                                        <div>
                                            <p className="text-3xl font-bold text-gray-900 whitespace-nowrap">{card.value}</p>
                                            {card.subValue && (
                                                <p className={`text-xl font-semibold ${card.subValueColor || 'text-gray-600'} mt-1`}>{card.subValue}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom KPI Cards - 2 cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {bottomKpiCards && bottomKpiCards.length > 0 ? (
                            bottomKpiCards.map((card, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleCardClick(card.link)}
                                    className={`bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${card.link ? 'cursor-pointer' : ''}`}
                                >
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-5 rounded-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity`}></div>
                                    <div className="flex flex-col items-center text-center relative z-10">
                                        <div className={`w-20 h-20 rounded-2xl ${card.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}>
                                            <i className={`${card.icon} text-4xl`}></i>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3 font-semibold">{card.label}</p>
                                        <div>
                                            <p className="text-3xl font-bold text-gray-900 whitespace-nowrap">{card.value}</p>
                                            {card.subValue && (
                                                <p className={`text-xl font-semibold ${card.subValueColor || 'text-gray-600'} mt-1`}>{card.subValue}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">데이터를 불러올 수 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </AdminLayout>
        );
    } catch (error) {
        console.error('Dashboard rendering error:', error);
        return (
            <AdminLayout>
                <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-500">대시보드를 불러오는 중 오류가 발생했습니다.</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }
}
