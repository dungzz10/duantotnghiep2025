import accessory from "../models/accessory.js";
import CatchAsync from "../utils/CatchAsync.js";
export const createAccessory = CatchAsync(async (req, res, next) => {
  // Log user và dữ liệu sản phẩm để kiểm tra
  console.log(req.user);
  const data = req.body;

  console.log(data, 999);

  // Gán ID người dùng vào sản phẩm
  data.user = req.user.id;

  // Tạo sản phẩm mới từ dữ liệu nhận được
  const newAccessory = await accessory.create(data);
  console.log(newAccessory, 7898789);

  // Trả về phản hồi thành công
  res.status(201).json({
    success: true,
    newAccessory,
  });
});

export const getallAccessory = CatchAsync(async (req, res, next) => {
  try {
    const accessoris = await accessory.find();
    if (accessory.length === 0) {
      return res.json({
        message: "Không có danh mục nào",
      });
    }
    return res.status(200).json({
      message: "thành công",
      data: accessoris,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

export const updateAccessory = CatchAsync(async (req, res, next) => {});
export const deleteAccessory = CatchAsync(async (req, res, next) => {});
