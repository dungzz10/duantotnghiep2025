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
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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

const SideMEnu = ({ isCollapsed, onToggleSidebar }) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Nút Toggle */}
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-2xl font-bold tracking-wide">
          {isCollapsed ? "" : "AdminPanel"}
        </span>

        <button 
          onClick={onToggleSidebar} 
          className="text-xl p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
        >
          {isCollapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        theme="dark"
        className="w-full text-white"
        items={menuItems}
        onClick={(item) => navigate(item.key)}
        inlineCollapsed={isCollapsed}
        openKeys={isCollapsed ? [] : openKeys}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
};

export default SideMEnu;
