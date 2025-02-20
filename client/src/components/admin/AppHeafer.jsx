import React from "react";
import { Typography, Image, Space, Badge, Button } from "antd";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../app/hook/logoutAdmin";

const AppHeafer = ({ admin }) => {
  const navigate = useNavigate();
  const { Logout } = adminLogout();

  const handleLoginClick = () => {
    navigate("/admin/loginadmin");
  };

  const handleLogout = () => {
    console.log("Logout");
    Logout(); // Đăng xuất
  };

  return (
    <div className="h-[50px] flex justify-between align-middle p-4 border-b-gray-100">
      <Image
        width={40}
        src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.facebook.com%2Fduantotnghiep2025%2F&psig=AOvVaw3Q6Z9Q6Q6Z9Q6"
      ></Image>
      <Typography.Title level={3}>Admin</Typography.Title>
      <Space>
        <Badge>Mail</Badge>
        {admin ? (
          <div className="dropdown dropdown-end z-20">
            {/* Avatar (Button để mở dropdown) */}
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  src={admin.photo || "https://via.placeholder.com/40"}
                  alt="User Avatar"
                />
              </div>
            </div>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="text-red-600">
                  Logout
                </button>
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
