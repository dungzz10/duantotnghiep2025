import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import axios from "axios";

const MomoSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const orderId = params.get("orderId");
        const resultCode = params.get("resultCode");

        console.log("token:", localStorage.getItem("token"));

        // Sửa lại cách gọi axios.get - chỉ có 2 tham số: URL và config object
        const response = await axios.get(
          `${getBaseUrl()}/api/v1/user/payment/verify/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );

        console.log("API response:", response.data);
        console.log("orderid", response.data.success, resultCode, orderId);

        if (response.data.success && resultCode == "0") {
          message.success("Thanh toán thành công!");
          console.log("orderid", orderId.startsWith("DEPOSIT"), orderId);

          if (orderId.startsWith("DEPOSIT")) {
            navigate("/profile");
          } else {
            navigate("/orders");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        message.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi xác thực thanh toán!"
        );
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl mb-4">Đang xử lý thanh toán...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default MomoSuccess;
