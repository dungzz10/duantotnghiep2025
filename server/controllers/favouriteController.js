import usersModel from "../models/usersModel.js";

export const createFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await usersModel.findById(userId);

    if (!userId) {
      return res.status(404).json({ message: "tai khoan khong ton tai" });
    }

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    res.status(200).json({
      status: 200,
      data: {
        favourites: user.favourites,
      },
    });
  } catch (error) {
    console.log("loi :", error);
  }
};

export const removeFavourite = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const user = await usersModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const productIndex = user.favourites.indexOf(productId);

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: "Sản phẩm không có trong danh sách yêu thích" });
    }

    user.favourites.splice(productIndex, 1);
    await user.save();

    res.status(200).json({
      status: 200,
      data: {
        favourites: user.favourites,
      },
    });
  } catch (error) {
    console.log("Lỗi: ", error);
    res.status(500).json({ message: "Đã xảy ra lỗi, vui lòng thử lại sau" });
  }
};
