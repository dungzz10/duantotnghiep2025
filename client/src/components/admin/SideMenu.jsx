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
  { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
  { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "Inventory" },
  { key: "/admin/categories", icon: <ShoppingCartOutlined />, label: "Danh mục" },
  { key: "/admin/customers", icon: <UserOutlined />, label: "Customers" },
  { key: "/admin/products", icon: <ShopOutlined />, label: "Products" },
  { key: "/admin/banners", icon: <ShopOutlined />, label: "Banners" },

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
