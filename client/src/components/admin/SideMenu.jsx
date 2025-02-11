import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import PageContain from "./PageContain";

const menuItems = [
  { key: "/admin/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
  { key: "/admin/inventory", icon: <DatabaseOutlined />, label: "Inventory" },
  { key: "/admin/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "/admin/customers", icon: <UserOutlined />, label: "Customers" },
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
        <div className="text-xl flex items-start p-5">Welcome to Admin Panel</div> 
        <div className="flex-grow">
          <PageContain></PageContain>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
