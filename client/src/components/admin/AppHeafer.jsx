import React from "react";
import { Typography, Image, Space, Button, Badge, Dropdown, notification } from "antd";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../app/hook/logoutAdmin";
import { MailIcon } from "lucide-react";
import moment from "moment";

const AppHeafer = ({ admin }) => {
  const navigate = useNavigate();
  const { Logout } = adminLogout();
  const [newOrders, setNewOrders] = useState([]);
  const [prevOrderCount, setPrevOrderCount] = useState(0);
  
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return console.error("Token không tồn tại, vui lòng đăng nhập lại!");
  
      try {
        const res = await fetch("http://localhost:5000/api/v1/orders/new", {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          credentials: "include",
        });
        const data = await res.json();
        const newOrderCount = data.newOrders?.length || 0;

        if (newOrderCount > prevOrderCount && admin) {
          notification.open({
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
    const interval = setInterval(fetchOrders, 4000);
    return () => clearInterval(interval);
  }, [admin, prevOrderCount]);
  
  const handleLoginClick = () => {
    navigate("/admin/loginadmin");
  };

  const handleLogout = () => {
    console.log("Logout");
    Logout();
  };

  const visibleOrders = newOrders.slice(0, 7);

  const orderMenu = (
    <div className="bg-white shadow-md rounded-md p-2 w-60">
      {newOrders.length === 0 ? (
        <p className="text-center text-gray-500">Không có đơn hàng mới.</p>
      ) : (
        visibleOrders.map((order) => (
          <p key={order._id} className="px-3 py-2 text-gray-700">
            🛒 Đơn #{order._id} - {order?.userId?.name || "Khách hàng"} - 🕒 {moment(order.date).format("HH:mm DD/MM/YYYY")}
          </p>
        ))
      )}
    </div>
  );

  return (
    <div className="h-[50px] flex justify-between align-middle p-4 border-b-gray-100">
      <Image
        width={40}
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fduantotnghiep2025%2F&psig=AOvVaw3Q6Z9Q6Q6Q6Z9Q6"
      ></Image>
      <Typography.Title level={3}>Admin</Typography.Title>
      <Space>
        {/* Thông báo đơn hàng mới */}
        <Dropdown overlay={orderMenu} trigger={["click"]} placement="bottomRight">
          <Badge count={newOrders.length} overflowCount={7} className="cursor-pointer">
            <MailIcon size={24} />
          </Badge>
        </Dropdown>

        {admin ? (
          <div className="dropdown dropdown-end z-20">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={admin.photo || "https://via.placeholder.com/40"} alt="User Avatar" />
              </div>
            </div>

            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow">
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-600">Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <Button onClick={handleLoginClick}>Login</Button> // Nút Login
        )}
      </Space>
    </div>
  );
};

export default AppHeafer;
