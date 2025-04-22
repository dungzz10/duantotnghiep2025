import React, { useState } from "react";
import axios from "axios";

const SearchOrders = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!orderId.trim()) {
      setError("Vui lòng nhập mã đơn hàng.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/orders/${orderId}`
      );
      setOrder(response.data.order);
    } catch (err) {
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => `${value.toLocaleString()} VNĐ`;

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        {" "}
        Tra cứu đơn hàng
      </h1>

      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Nhập mã đơn hàng (VD: ORD123456)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Đang tìm..." : "Tra cứu"}
        </button>
      </div>

      {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

      {order && (
        <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">Đơn hàng: {order.orderId}</h2>
              <p className="text-gray-600">
                Ngày đặt: {new Date(order.date).toLocaleString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-semibold">
                Trạng thái đơn:{" "}
                <span
                  className={`capitalize px-2 py-1 rounded ${
                    order.orderStatus === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.orderStatus === "cancelled"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
              <p className="font-semibold">
                Thanh toán:{" "}
                <span
                  className={`capitalize px-2 py-1 rounded ${
                    order.paymentStatus === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.paymentStatus === "failed"
                      ? "bg-red-100 text-red-600"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Phương thức: {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">📦 Thông tin giao hàng</h3>
              <p>
                <strong>Người nhận:</strong>{" "}
                {order.shippingAddress?.recipientName ||
                  order.userId?.name ||
                  "N/A"}
              </p>
              <p>
                <strong>SĐT:</strong>{" "}
                {order.shippingAddress?.recipientPhone ||
                  order.userId?.phoneNumber ||
                  "N/A"}
              </p>
              <p>
                <strong>Địa chỉ:</strong>{" "}
                {order.shippingAddress?.recipientAddress ||
                  order.shippingAddress?.address ||
                  "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold mb-2"> Thanh toán</h3>
              <p>
                <strong>Tạm tính:</strong> {formatCurrency(order.total)}
              </p>
              <p>
                <strong>Phí giao hàng:</strong>{" "}
                {formatCurrency(order.shippingFee)}
              </p>
              <p>
                <strong>Giảm giá:</strong>{" "}
                {formatCurrency(order.voucherDiscount)}
              </p>
              <p className="font-semibold text-lg mt-2">
                Tổng thanh toán: {formatCurrency(order.finalTotal)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">🛒 Danh sách sản phẩm</h3>
            <ul className="space-y-4">
              {order.products.map((item, idx) => (
                <li
                  key={idx}
                  className="border p-4 rounded-md shadow-sm flex gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="font-medium text-lg">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Kích cỡ: {item.size} | Màu: {item.color}
                    </p>
                    <p>Đơn giá: {formatCurrency(item.price)}</p>
                    <p>Số lượng: {item.quantity}</p>
                    <p className="font-semibold">
                      Thành tiền: {formatCurrency(item.totalPrice)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {order.statusHistory?.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">📅 Lịch sử trạng thái</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {order.statusHistory.map((s, idx) => (
                  <li key={idx}>
                    <span className="capitalize font-medium">{s.status}</span> -{" "}
                    {new Date(s.date).toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchOrders;
