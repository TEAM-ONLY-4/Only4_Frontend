import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/", icon: "ri-dashboard-line", label: "대시보드" },
    { path: "/settlement", icon: "ri-file-list-3-line", label: "정산 관리" },
    { path: "/sending", icon: "ri-send-plane-line", label: "발송 관리" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col z-20`}
      >
        {/* Logo Section */}
        {/* justify-center: 닫혔을 때 버튼 중앙 정렬을 위해 필요 */}
        <div
          className={`h-16 flex items-center px-4 border-b border-gray-200 overflow-hidden transition-all duration-300 ${isSidebarOpen ? "justify-between" : "justify-center"}`}
        >
          {/* [슬라이딩 영역] 로고 + 텍스트 */}
          {/* 닫히면 w-0, opacity-0으로 부드럽게 사라짐 */}
          <div
            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
              isSidebarOpen ? "w-56 opacity-100 mr-2" : "w-0 opacity-0 mr-0"
            }`}
          >
            <img
              src="https://static.readdy.ai/image/02023d2e1cba25e4e20cfe12764d19dc/e91e4c486b3e3fcba1de01aace44adca.png"
              alt="Logo"
              className="w-8 h-8 flex-shrink-0 object-contain"
            />
            <h1 className="ml-3 text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">
              정산 및 발송 관리 시스템
            </h1>
          </div>

          {/* [고정 영역] 토글 버튼 */}
          {/* 항상 존재하며 아이콘만 바뀜 */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <i
              className={`${
                isSidebarOpen ? "ri-menu-fold-line" : "ri-menu-unfold-line"
              } text-xl transition-all duration-300`}
            ></i>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-hidden">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                // 닫혔을 때는 중앙 정렬(justify-center)하여 아이콘이 가운데 오도록 함
                className={`flex items-center h-12 px-3 rounded-lg transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-700 hover:bg-gray-100"
                } ${!isSidebarOpen ? "justify-center" : ""}`}
              >
                {/* 아이콘: 크기 고정 */}
                <i className={`${item.icon} text-xl flex-shrink-0`}></i>

                {/* 텍스트: 닫히면 너비 0으로 줄어들며 사라짐 */}
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${
                    isSidebarOpen
                      ? "w-auto opacity-100 ml-3"
                      : "w-0 opacity-0 ml-0"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
