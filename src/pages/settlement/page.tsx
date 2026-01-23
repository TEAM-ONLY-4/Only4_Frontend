import AdminLayout from '../../components/feature/AdminLayout';
import { useState } from 'react';

export default function Settlement() {
    const [settlements, setSettlements] = useState<Array<{
        month: string;
        target: number;
        completed: number;
        totalAmount: number;
        progress: number;
        executedAt: string;
    }>>([]);

    const formatAmount = (amount: number) => {
        const eok = Math.floor(amount / 100000000);
        const man = Math.floor((amount % 100000000) / 10000);

        if (eok > 0 && man > 0) {
            return `${eok.toLocaleString()}억 ${man.toLocaleString()}만원`;
        } else if (eok > 0) {
            return `${eok.toLocaleString()}억원`;
        } else if (man > 0) {
            return `${man.toLocaleString()}만원`;
        } else {
            return `${amount.toLocaleString()}원`;
        }
    };

    const handleSettlement = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const dateStr = `${year}-${month}`;
        const executedAt = `${year}/${month}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        const newSettlement = {
            month: dateStr,
            target: 1000000,
            completed: Math.floor(Math.random() * 200000) + 900000,
            totalAmount: Math.floor(Math.random() * 5000000000) + 70000000000,
            progress: Math.floor(Math.random() * 20) + 80,
            executedAt: executedAt
        };

        setSettlements([newSettlement, ...settlements]);
    };

    return (
        <AdminLayout>
            <div className="p-8 bg-gray-50 min-h-screen">
                {/* 헤더 */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">정산 관리</h1>
                        <p className="mt-1 text-sm text-gray-500">월별 정산을 실행하고 정산 현황 및 결과를 확인합니다</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSettlement}
                            className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap flex items-center gap-2"
                        >
                            <i className="ri-play-line"></i>
                            정산 실행
                        </button>
                    </div>
                </div>

                {/* Settlement Status */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <i className="ri-file-list-3-line text-teal-600"></i>
                            정산 실행 현황
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        {settlements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 px-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <i className="ri-file-list-3-line text-3xl text-gray-400"></i>
                                </div>
                                <p className="text-base font-medium text-gray-900 mb-2">아직 실행된 정산이 없습니다</p>
                                <p className="text-sm text-gray-500 text-center">우측 상단의 '정산 실행' 버튼을 눌러 이번 달 정산을 시작하세요</p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">정산월</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">대상 건수</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">정산 완료</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">진행률</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">총 청구 금액</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">정산 실행 일시</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {settlements.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{item.month}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-900">{item.target.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{item.completed.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-24">
                                                    <div
                                                        className="h-full bg-teal-500 transition-all"
                                                        style={{ width: `${item.progress}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-600">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-medium text-gray-900">{formatAmount(item.totalAmount)}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-gray-600">{item.executedAt}</span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
