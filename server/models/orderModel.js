import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      title: String,
      color: String,
      size: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Số lượng phải ít nhất là 1"],
      },
      totalPrice: {
        type: Number,
        required: true, 
      },
      image: String,
    },
  ],
  shippingAddress: {
    address: {
      type: String,
      required: true,
    },
    addressType: {
      type: String,
      default: "home",
    },
  },
  shippingFee: {
    type: Number,
    default: 30000, 
  },
  voucherDiscount: {
    type: Number,
    default: 0, 
  },
  finalTotal: {
    type: Number,
    required: true, 
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "ATM_MOMO", "WALLET","MoMo"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  transactionId: String, 
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
