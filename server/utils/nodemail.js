import nodemailer from "nodemailer";

// Tạo transporter cho Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dunghqph33551@fpt.edu.vn",
    pass: "peut qngo ivwo gftj",
  },
});

// Hàm gửi email
export const sendEmail = async (email, emailMessage) => {
  try {
    const mailOptions = {
      from: "WD20@gmail.com",
      to: email,
      subject: "Phản Hồi Liên Hệ Của Bạn",
      text: emailMessage,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const sendOrderConfirmationEmail = async ({
  to,
  orderId,
  products,
  total,
  shippingFee,
  finalTotal,
  orderStatus,
  paymentStatus,
  paymentMethod,
  shippingAddress,
  voucherDiscount,
}) => {
  const orderMailOptions = {
    from: "WD20@gmail.com",
    to,
    subject: "Xác nhận đơn hàng từ WD20",
    html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="color: #4CAF50;">🎉 Đơn hàng của bạn đã được tạo thành công!</h2>
    <p><strong>Mã đơn hàng:</strong> ${orderId}</p>
    <p><strong>Trạng thái đơn hàng:</strong> ${orderStatus}</p>
     <p><strong>Trạng thái thanh toán:</strong> ${paymentStatus}</p>
    <h3 style="margin-top: 24px;">🛍️ Sản phẩm đã đặt:</h3>
    <table style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">Hình ảnh</th>
          <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ccc;">Tên</th>
          <th style="text-align: center; padding: 8px; border-bottom: 1px solid #ccc;">Số lượng</th>
          <th style="text-align: right; padding: 8px; border-bottom: 1px solid #ccc;">Giá</th>
        </tr>
      </thead>
      <tbody>
        ${products
          .map(
            (product) => `
              <tr>
                <td style="padding: 8px;"><img src="${product.image}" alt="${
              product.name
            }" width="80" style="border-radius: 8px;" /></td>
                <td style="padding: 8px;">${product.name}</td>
                <td style="padding: 8px; text-align: center;">${
                  product.quantity
                }</td>
                <td style="padding: 8px; text-align: right;">${product.price.toLocaleString()} VNĐ</td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 32px;">
      <h3 style="margin-bottom: 8px;">🚚 Thông tin giao hàng:</h3>
      <p><strong>Địa chỉ:</strong> ${shippingAddress.address}</p>

      <h3 style="margin: 24px 0 8px;">💰 Thanh toán:</h3>
      <p><strong>Phương thức:</strong> ${paymentMethod}</p>
      <p><strong>Tổng giá sản phẩm:</strong> ${total.toLocaleString('vi-VN')} VNĐ</p>
      <p><strong>Phí vận chuyển:</strong> ${shippingFee.toLocaleString('vi-VN')} VNĐ</p>
      <p><strong>Mã giảm giá:</strong> ${voucherDiscount?.toLocaleString?.("vi-VN") || 0} VNĐ</p>
      <p><strong>Tổng thanh toán:</strong> <span style="color: #d32f2f; font-size: 18px;"><strong>${finalTotal.toLocaleString('vi-VN')} VNĐ</strong></span></p>

      <p><strong>⏰ Thời gian đặt hàng:</strong> ${new Date().toLocaleString()}</p>
    </div>

    <hr style="margin: 24px 0;" />
    <p style="text-align: center;">Cảm ơn bạn đã mua sắm tại <strong>WD20 Shop</strong>! ❤️</p>
    <img src="../../client/src/assets/theshoes.png" alt="Logo" style="width: 100px; display: block; margin: 0 auto; text-align: center;" />
  </div>
`,
  };

  try {
    await transporter.sendMail(orderMailOptions);
    console.log("Đã gửi email xác nhận đơn hàng thành công.");
  } catch (error) {
    console.error("Lỗi khi gửi email đơn hàng:", error);
  }
};
