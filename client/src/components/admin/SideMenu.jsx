import React, { useState } from "react";
import { Menu } from "antd";
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined,
  UserOutlined,
  ShopOutlined,
  FileImageOutlined,
  TeamOutlined,
  SettingOutlined,
  PhoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import PageContain from "./PageContain";

const menuItems = [
  { key: "/admin/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  {
    key: "store",
    label: "Quản lý cửa hàng",
    icon: <ShopOutlined />,
    children: [
      { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Đơn hàng" },
      { key: "/admin/products", icon: <ShopOutlined />, label: "Sản phẩm" },
      { key: "/admin/danh-muc", icon: <UnorderedListOutlined />, label: "Danh mục" },
      { key: "/admin/warehouse", icon: <HomeOutlined />, label: "Kho hàng" },
    ],
  },
  {
    key: "appearance",
    label: "Quản lý giao diện",
    icon: <FileImageOutlined />,
    children: [{ key: "/admin/banners", icon: <FileImageOutlined />, label: "Banner quảng cáo" }],
  },
  {
    key: "users",
    label: "Người dùng",
    icon: <TeamOutlined />,
    children: [
      { key: "/admin/customers", icon: <TeamOutlined />, label: "Khách hàng" },
      { key: "/admin/useradmin", icon: <UserOutlined />, label: "Quản trị viên" },
    ],
  },
  {
    key: "settings",
    label: "Cấu hình & Liên hệ",
    icon: <SettingOutlined />,
    children: [
      { key: "/admin/lien-he", icon: <PhoneOutlined />, label: "Liên hệ" },
      { key: "/admin/settings", icon: <SettingOutlined />, label: "Cài đặt" },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]); // State lưu menu nào đang mở

  const handleOpenChange = (keys) => {
    setOpenKeys(keys); // Khi click vào menu cha, nó mở rộng hoặc xếp gọn
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Desktop */}
      <div
        className={` md:flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        } flex-shrink-0 bg-gray-900 text-white shadow-xl`}
      >
        {/* Logo + Toggle Button */}
        <div className="flex items-center justify-between px-4 py-5">
          <span className="text-2xl font-bold tracking-wide">
            {collapsed ? "🛠" : "AdminPanel"}
          </span>
          <button
            className="text-lg p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Menu với Dropdown */}
        <Menu
          mode="inline"
          theme="dark"
          className="w-full text-white"
          items={menuItems}
          onClick={(item) => navigate(item.key)}
          inlineCollapsed={collapsed}
          openKeys={collapsed ? [] : openKeys} // Khi collapsed thì menu con đóng hết
          onOpenChange={handleOpenChange} // Xử lý toggle dropdown
        />
      </div>

      {/* Main Content */}
      <div className="flex-grow flex-col">
        <div className="flex-grow p-5">
          <PageContain />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
