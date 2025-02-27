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
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
