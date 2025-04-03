import React, { useEffect, useState } from "react";
import { Typography, Image, Space, Button, Badge, Dropdown, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { adminLogout } from "../../app/hook/logoutAdmin";
import { BellOutlined, UserOutlined, LogoutOutlined, ShopOutlined } from "@ant-design/icons";
import moment from "moment";

const AppHeader = ({ admin }) => {
  const navigate = useNavigate();
  const { Logout } = adminLogout();
  const [newOrders, setNewOrders] = useState([]);
  const [prevOrderCount, setPrevOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${getBaseUrl()}/api/v1/orders/new`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        const newOrderCount = data.newOrders?.length || 0;

        if (newOrderCount > prevOrderCount && admin) {
          notification.info({
            message: "Thông báo đơn hàng mới",
            description: `Bạn có ${newOrderCount} đơn hàng mới!`,
            placement: "topRight",
            duration: 2,
          });
        }

        setNewOrders(data.newOrders || []);
        setPrevOrderCount(newOrderCount);
      } catch (error) {
        console.error("Lỗi khi lấy đơn hàng mới:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [admin, prevOrderCount]);

  const handleLoginClick = () => navigate("/admin/loginadmin");
  const handleLogout = () => Logout();

  const visibleOrders = newOrders.slice(0, 5);

  const orderMenu = (
    <div className="bg-white shadow-lg rounded-lg p-3 w-72">
      {newOrders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng mới.</p>
      ) : (
        visibleOrders.map((order) => (
          <p key={order._id} className="px-3 py-2 text-gray-700 border-b">
            🛒 Đơn mới của {order?.userId?.name || "Khách hàng"} - 🕒 {moment(order.date).format("HH:mm DD/MM/YYYY")}
          </p>
        ))
      )}
    </div>
  );

  return (
    <header className="flex items-center justify-between p-2 w-full bg-gradient-to-r from-blue-700 to-purple-700 text-white shadow-md">
      {/* Logo & Tiêu đề */}
      <div className="ml-4">
        <Link to="/">
          <Image width={100} src="/src/assets/theshoes.png" preview={false} alt="Logo" className="rounded-md" />
        </Link>
      </div>
        <Typography.Title level={3} className="text-white font-semibold">THE SHOES </Typography.Title>

      <Space size="large">
        {/* Thông báo đơn hàng mới */}
        <Dropdown overlay={orderMenu} trigger={["click"]} placement="bottomRight">
          <Badge count={newOrders.length} overflowCount={5} className="cursor-pointer">
            <BellOutlined className="text-2xl" />
          </Badge>
        </Dropdown>

        {/* Nếu đã đăng nhập admin */}
        {admin ? (
          <Dropdown
            overlay={
              <div className="bg-white shadow-lg rounded-lg w-48 p-2">
                <p className="px-3 py-2 border-b text-gray-700 font-semibold flex items-center">
                  <UserOutlined className="mr-2" /> {admin.name || "Admin"}
                </p>
                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-100">Trang cá nhân</Link>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100">
                  <LogoutOutlined className="mr-2" /> Đăng xuất
                </button>
              </div>
            }
            trigger={["click"]}
            placement="bottomRight"
          >
            <div className="cursor-pointer flex items-center space-x-2">
              <Image
                width={40}
                height={40}
                src={admin.photo || "/default-avatar.png"}
                preview={false}
                className="rounded-full border"
              />
              <span className="hidden md:inline font-semibold">{admin.name}</span>
            </div>
          </Dropdown>
        ) : (
          <Button onClick={handleLoginClick} type="primary" className="bg-yellow-500 border-none">Đăng nhập</Button>
        )}
      </Space>
    </header>
  );
};

export default AppHeader;