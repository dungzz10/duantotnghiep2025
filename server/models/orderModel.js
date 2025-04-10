import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  customerPhone: {
    type: Number,
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
  total: {
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
    recipientAddress: {
      type: String,
      required: function () {
        return (
          this.recipientAddress || this.recipientName || this.recipientPhone
        );
      },
    },
    recipientName: {
      type: String,
      required: function () {
        return this.recipientName || this.recipientPhone;
      },
    },
    recipientPhone: {
      type: String,
      required: function () {
        return this.recipientName || this.recipientPhone;
      },
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
    enum: ["COD", "ATM_MOMO", "WALLET", "MoMo"],
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
    enum: ["pending", "processing", "shipped", "delivered","trahang", "cancelled"],
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  cancellation: {
    reason: String,
    images: [String], // Array of image URLs
    date: Date,
    isConfirmed: {
      type: Boolean,
      default: false
    },
    confirmationDate: Date,
    userConfirmed: Boolean 
  },
  returnRequest: {
    reason: String,
    images: [String], 
    date: Date,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    approvalDate: Date,
    userConfirmed: Boolean 
  },
});
orderSchema.post("save", async function (doc, next) {
  const Product = mongoose.model("Product");

  for (const item of doc.products) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    // Tìm biến thể đúng màu
    const variant = product.variants.find((v) => v.color === item.color);
    if (!variant) continue;

    // Tìm đúng size
    const sizeObj = variant.sizes.find((s) => s.size === item.size);
    if (!sizeObj) continue;

    // Trừ số lượng tồn kho
    sizeObj.quantity = Math.max(0, sizeObj.quantity - item.quantity);

    // Cập nhật lại status dựa trên logic cũ
    const allSoldOut =
      product.variants?.length > 0 &&
      product.variants.every(
        (v) =>
          Array.isArray(v.sizes) &&
          v.sizes.length > 0 &&
          v.sizes.every(
            (s) => typeof s.quantity === "number" && s.quantity === 0
          )
      );

    if (allSoldOut) {
      product.status = "sold out";
    } else if (product.salePrice && product.salePrice > 0) {
      product.status = "sale";
    } else {
      product.status = "new";
    }

    await product.save(); // Lưu lại sản phẩm sau khi cập nhật
  }

  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
