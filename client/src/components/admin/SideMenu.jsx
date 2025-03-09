import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import PageContain from "./PageContain";

const menuItems = [
  { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
  { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "Tồn kho" },
  { key: "/admin/danh-muc", icon: <OrderedListOutlined />, label: "Danh mục" },
  { key: "/admin/warehouse", icon: <OrderedListOutlined />, label: "Kho hàng" },
  { key: "/admin/customers", icon: <UserOutlined />, label: "Customers" },
  { key: "/admin/useradmin", icon: <UserOutlined />, label: "Admin" },
  { key: "/admin/products", icon: <ShopOutlined />, label: "Products" },
  { key: "/admin/banners", icon: <ShopOutlined />, label: "Banners" },
  { key: "/admin/lien-he", icon: <OrderedListOutlined />, label: "Liên hệ" },
  { key: "/admin/orders", icon: <OrderedListOutlined />, label: "Đơn hàng" },

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
      <div className="flex-grow flex-col mt-10">
        <div className="flex-grow">
          <PageContain></PageContain>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
