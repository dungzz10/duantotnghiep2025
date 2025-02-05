import Product from"../models/productModel.js";
import CatchAsync from"../utils/CatchAsync.js";
import HandelError from"../utils/Error.js";
import User from"../models/usersModel.js";
// list san pham
export const GetallProduct = async (req, res) => {
  try {
      const product = await Product.find().populate("CategoryId")
      if (product.length === 0) {
          return res.status(404).json({
              message: "Không có sản phẩm nào",
          });
      }
      return res.status(200).json({
          message: "thành công",
          data: product
      });
  } catch (error) {
      return res.status(500).json({
          message: error.message,
      });
  }
};

// export const getOneProduct = async function (req, res) {
//   const productId = req.params.productId; // Lấy id của bài đăng
//   try {
//       const product = await Product.findById(req.params.id).populate("tags").populate("CategoryId")
//       if (!product) {
//           return res.status(404).json({
//               message: "Không tìm thấy sản phẩm",
//           });
//       }
//       // Tìm các bài đăng liên quan
//       const relatedProducts = await Product.find({
//           $and: [
//               { _id: { $ne: productId } },
//               { $or: [{ tags: { $in: product.tags } }, { CategoryId: product.CategoryId }] }],
//       }).limit(6).populate("tags");
//       // Tăng số lượt xem lên một đơn vị
//       product.views++;
//       await product.save();
//       return res.status(200).json({
//           message: "thành công",
//           data: product, relatedProducts
//       });

//   } catch (error) {
//       return res.status(500).json({
//           message: error.message,
//       });
//   }
// };
// tao san pham moi
export const createProduct = CatchAsync(async (req, res, next) => {
  console.log(req.user)
  const productData = req.body;
  console.log(productData)
   console.log(req.user)
  productData.user = req.user.id;
  const product = new Product(productData);
  await product.save();
  const user = await User.findById(req.user.id);
  user.numProducts +=1
  await user.save()
  res.status(201).json({
    success: true,
    product,
  });
  //
});
export const RemoveProduct = async function (req, res) {
  try {
      const product = await Product.findByIdAndDelete(req.params.id);
      return res.status(200).json({
          message: "Xóa sản phẩm thành công",
          product,
      });
  } catch (error) {
      return res.status(500).json({
          message: error.message,
      });
  }
};