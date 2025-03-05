import productModel from "../models/productModel.js";
import usersModel from "../models/usersModel.js";

export const createFavourite = async (req, res) => {
  try {
    console.log(12344, req.user);

    const userId = req.user.id;
    const productId = req.body.productId;

    console.log(userId, productId, 99999);

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

export const getFavourites = async (req, res) => {
  const userId = req.user.id;
  console.log();

  const user = await usersModel.findById(userId);

  if (!user) {
    throw new Error(message, "tai khoan k ton tai");
  }

  // lay id san pham yeu thich
  const favouritesId = user.favourites;

  // tu id san pham yeu thich lay toan bo thong tin cua san pham
  const favourites = await productModel.find({
    _id: { $in: favouritesId },
  });

  res.status(200).json({
    success: true,
    data: {
      favourites,
    },
  });
};

export const removeFavourite = async (req, res) => {
  try {
    const userId = req.user.id;

    const productId = req.body.productId;

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
