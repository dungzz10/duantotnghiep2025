import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/admin/AppHeader";
import SideMEnu from "../components/admin/SideMEnu";
import AppFooter from "../components/admin/AppFooter";
import { useAdmin } from "../app/hook/LoadAdmin";

const LayoutAdmin = () => {
  const { admin, isloading } = useAdmin();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true); // Tự động đóng sidebar khi màn hình nhỏ
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Gọi ngay khi component mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isloading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <AppHeader onToggleSidebar={() => setIsCollapsed(!isCollapsed)} admin={admin} />

      {/* Kiểm tra quyền admin */}
      {["admin", "superadmin"].includes(admin?.role) ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`relative transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
              } bg-gray-900 text-white flex-shrink-0`}
          >
            <SideMEnu isCollapsed={isCollapsed} onToggleSidebar={() => setIsCollapsed(!isCollapsed)} />
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 pl-6 pt-2 bg-gray-100 overflow-auto">
            <div className={`flex-1 pl-6 pt-2 bg-gray-100 overflow-auto transition-all duration-300 z-0 ${!isCollapsed && window.innerWidth < 768 ? "blur-sm" : ""
              }`}
            >
              <Outlet />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center text-red-500 text-lg">
          Bạn cần phải đăng nhập để thực hiện hành động này.
        </div>
      )}

      {/* Footer */}
      <AppFooter />
    </div>
  );
};

export default LayoutAdmin;
