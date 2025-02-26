import express from "express";
import axios from "axios";
import crypto from "crypto";

const router = express.Router();

const momoConfig = {
  endpoint: "https://test-payment.momo.vn/v2/gateway/api/create",
  partnerCode: "MOMOBKUN20180529",
  accessKey: "klm05TvNBzhg7h7j",
  secretKey: "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa",
  redirectUrl: "http://localhost:5173/momo-success",
  ipnUrl: "http://localhost:5000/api/momo-ipn", 
};

router.post("/payment", async (req, res) => {
  try {
    const { amount, orderId, orderInfo } = req.body;
    if (!amount || !orderId || !orderInfo) {
      return res.status(400).json({ error: "Thiếu dữ liệu đơn hàng" });
    }

    const requestId = orderId;
    const requestType = "payWithATM";
    const extraData = "";

    const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=payWithATM`;
    const signature = crypto.createHmac("sha256", momoConfig.secretKey).update(rawSignature).digest("hex");

    const payload = {
      partnerCode: momoConfig.partnerCode,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl: momoConfig.redirectUrl,
      ipnUrl: momoConfig.ipnUrl,
      extraData,
      requestType: "payWithATM", 
      signature,
      lang: "vi",
    };
    

    const { data } = await axios.post(momoConfig.endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });

    if (data.resultCode === 0) {
      res.json({ payUrl: data.payUrl });
    } else {
      res.status(400).json({ error: "Thanh toán MoMo thất bại!", data });
    }
  } catch (error) {
    console.error("MoMo Payment Error:", error);
    res.status(500).json({ error: "Lỗi xử lý thanh toán MoMo" });
  }
});
router.get("/success", (req, res) => {
  const { resultCode } = req.query;

  if (resultCode === "0") {
    res.redirect("http://localhost:5173/cart?success=true");
  } else {
    res.redirect("http://localhost:5173/cart?success=false");
  }
});
// Route xử lý IPN (callback từ MoMo)
router.post("/ipn", async (req, res) => {
  console.log("Nhận thông báo thanh toán từ MoMo:", req.body);
  res.status(200).json({ message: "IPN nhận thành công" });
});

export default router;
