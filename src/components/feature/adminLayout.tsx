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
          isSidebarOpen ? "w-68" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <img
                src="https://static.readdy.ai/image/02023d2e1cba25e4e20cfe12764d19dc/e91e4c486b3e3fcba1de01aace44adca.png"
                alt="Logo"
                className="w-8 h-8 flex-shrink-0 object-contain"
              />
              <h1 className="text-sm font-bold text-gray-900 whitespace-nowrap tracking-tight">
                정산 및 발송 관리 시스템
              </h1>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-auto cursor-pointer"
              >
                <i className="ri-menu-fold-line text-xl"></i>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <i className="ri-menu-unfold-line text-xl"></i>
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-50 text-teal-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
