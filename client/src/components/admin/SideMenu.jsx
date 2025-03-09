import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import PageContain from "./PageContain";

const menuItems = [
    { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: "Bảng thống kê" },
    { key: "/admin/orders", icon: <OrderedListOutlined />, label: "Đơn hàng" },
    { key: "/admin/products", icon: <ShopOutlined />, label: "Sản phẩm" },
    { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "Tồn kho" },
    { key: "/admin/danh-muc", icon: <OrderedListOutlined />, label: "Danh mục" },
    { key: "/admin/warehouse", icon: <OrderedListOutlined />, label: "Kho hàng" },
    { key: "/admin/banners", icon: <ShopOutlined />, label: "Ảnh bìa" },
    { key: "/admin/customers", icon: <UserOutlined />, label: "Khách hàng" },
    { key: "/admin/useradmin", icon: <UserOutlined />, label: "Quản trị viên" },
    { key: "/admin/lien-he", icon: <OrderedListOutlined />, label: "Liên hệ" }
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <div className="w-64 flex-shrink-0">
        <Menu
          mode="vertical"
          theme="light"
          className="w-full shadow-lg"
          items={menuItems}
          onClick={(item) => (console.log(item.key), navigate(item.key))}
        />
      </div>
      <div className="flex-grow flex-col">
        <div className="text-xl flex items-start p-5 w-full">Welcome to Admin Panel</div> 
        <div className="flex-grow">
          <PageContain></PageContain>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
