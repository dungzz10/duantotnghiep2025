import mongoose from "mongoose";
import moment from "moment-timezone";

moment.tz.setDefault("Asia/Ho_Chi_Minh");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Danh mục cần có tên"],
      minLength: [3, "Tên danh mục phải có ít nhất 3 ký tự"],
    },
    image: {
      type: String,
      required: [true, "Danh mục cần có hình ảnh"],
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.createdAt = moment(ret.createdAt).format("DD/MM/YYYY HH:mm:ss");
        ret.updatedAt = moment(ret.updatedAt).format("DD/MM/YYYY HH:mm:ss");
        delete ret.id;
      },
    },
  }
);

export default mongoose.model("Category", categorySchema);
