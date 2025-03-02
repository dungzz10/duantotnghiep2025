import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
import User from "../models/usersModel.js";
import mongoose from "mongoose";
import reviewModel from "../models/reviewModel.js";
// import Category from "../models/category";
// list san pham

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
  // Log user và dữ liệu sản phẩm để kiểm tra
  console.log(req.user);
  const productData = req.body;
  console.log(productData);

  // Kiểm tra trùng lặp title
  const existingProduct = await Product.findOne({ title: productData.title });
  if (existingProduct) {
    return next(new HandelError("Sản phẩm với tiêu đề này đã tồn tại.", 400));
  }

  // Gán ID người dùng vào sản phẩm
  productData.user = req.user.id;

  // Xử lý trường `image`
  if (Array.isArray(productData.image)) {
    productData.image = productData.image.map((image) => ({
      url: image,
      public_id: "some-public-id", // Gán giá trị public_id nếu cần
    }));
  }

  // Kiểm tra và xử lý danh mục
  // Tìm danh mục theo tên
  if (productData.category) {
    const category = await Category.findOne({ name: productData.category });

    // Nếu danh mục không tồn tại
    if (!category) {
      return next(new HandelError("Danh mục không tồn tại", 400));
    }

    // Lấy ID của danh mục và gán vào sản phẩm
    productData.category = category._id;
  }

  // Tạo sản phẩm mới từ dữ liệu nhận được
  const product = new Product(productData);

  // Lưu sản phẩm vào cơ sở dữ liệu
  await product.save();

  // Kiểm tra xem có category hay không và cập nhật danh mục
  if (productData.category) {
    await Category.findByIdAndUpdate(
      productData.category, // ID danh mục
      { $push: { products: product._id } }, // Thêm ID sản phẩm vào mảng products của danh mục
      { new: true }
    );
  }

//   //lấy tất cả đánh giá của  sản phẩm
//   const reviews = await Reviews.find({ productId: product._id });
//   //nếu có đánh giá tính rating trung bình 
//   if (reviews.length > 0) {
//     const totalRating = reviews.reduce(
//       (acc, review) => acc + review.rating,
//       0)
//     const averageRating = totalRating / reviews.length;
//   };
//   //cập nhật rating trung bình cho sản phẩm 
//   product.rating = averageRating;
//   await product.save();
// //chưa có bắt lỗi 
// Lấy tất cả đánh giá của sản phẩm
const reviews = await Reviews.find({ productId: product._id });

// Khởi tạo rating trung bình
let averageRating = 1;

// Nếu có đánh giá thì tính toán trung bình
if (reviews.length > 0) {
  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  averageRating = totalRating / reviews.length;
}

// Cập nhật rating trung bình cho sản phẩm
product.rating = averageRating;
await product.save();


  // Trả về phản hồi thành công
  res.status(201).json({
    success: true,
    product,
  });
});

export const getAllProduct = CatchAsync(async (req, res, next) => {
  // Sao chép req.query và loại bỏ các trường không cần thiết
  const queryObj = { ...req.query, isDeleted: false };
  console.log(queryObj);
  const excludedFields = ["page", "sort", "limit", "fields", "id"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Xử lý toán tử tìm kiếm theo biểu thức chính quy
  if (req.query.title) {
    queryObj.title = { $regex: req.query.title, $options: "i" };
  }

  // Chuyển đổi các toán tử thành cú pháp MongoDB (vd: gte -> $gte)
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt|in|ne)\b/g,
    (value) => `$${value}`
  );
  // console.log(queryString);
  // Tạo truy vấn cơ bản
  let query = Product.find(JSON.parse(queryString));

  // Xử lý sắp xếp
  if (req.query.sort) {
    // console.log(req.query.sort);
    const sortBy = req.query.sort.split(",").join(" "); // Chuyển "price,rating" thành "price rating"
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // Mặc định sắp xếp theo createdAt giảm dần
  }
  const countproduct = await Product.countDocuments(query);

  // Giới hạn trường dữ liệu trả về từ truy vấn
  if (req.query.fields) {
    // Chuyển danh sách trường từ dạng "name,price" thành "name price"
    const fields = req.query.fields.replace(/,/g, " ");

    // Áp dụng giới hạn trường vào truy vấn MongoDB
    query = query.select(fields);
  }
  // Phân trang
  // Lấy số trang từ query params, chuyển thành số nguyên
  // Nếu không có giá trị, mặc định là 1
  const page = req.query.page * 1 || 1;

  // Lấy số lượng phần tử tối đa trên mỗi trang từ query params, chuyển thành số nguyên
  // Nếu không có giá trị, mặc định là 3
  const limit = req.query.limit * 1 || 3;

  // Tính số lượng phần tử cần bỏ qua để lấy đúng dữ liệu của trang hiện tại
  const skip = limit * (page - 1);

  // Áp dụng phân trang vào truy vấn MongoDB bằng cách bỏ qua `skip` phần tử đầu tiên và giới hạn kết quả ở `limit` phần tử
  query = query.skip(skip).limit(limit);

  let totalPages;
  if (req.query.page) {
    totalPages = Math.ceil(countproduct / limit);
  }
  // console.log("total",totalPages);
  // Thực hiện truy vấn
  const products = await query;

  // Phản hồi kết quả
  res.status(201).json({
    totalPages,
    success: true,
    productLength: products.length,
    products,
    countproduct,
  });
});
export const getSingleProducts = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate("user", "email username");
    if (!product) {
        return res.status(404).send({ message: "Product not found" })
    }
    const reviews = await reviewModel.find({ productId }).populate("userId", "username email");
    res.status(200).send({ product, reviews })
} catch (error) {
    console.error("error fetching  product", error);
    res.status(500).send({ message: "failed to fetch the product" })
}
}
export const updateProduct = CatchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    product,
    message: "Cập nhật sản phẩm thành công",
  });
});

export const uppdatemanyProduct = CatchAsync(async (req, res, next) => {
  const { updateItem } = req.body;
  if (!updateItem || !Array.isArray(updateItem)) {
    return res.status(400).json({ message: "Dữ liệu cập nhật không hợp lệ" });
  }
  const updates = updateItem.map((item) => ({
    updateOne: {
      filter: { _id: item._id },
      update: { $set: item },
    },
  }));
  //  Thực hiện cập nhật hàng loạt bằng bulkWrite()
  await Product.bulkWrite(updates);
  res.status(200).json({
    success: true,
    message: "Cập nhật sản phẩm thành công",
  });
});
// Xóa mềm sản phẩm
export const softDeleteProduct = CatchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Sản phẩm đã được xóa mềm",
  });
});

// Khôi phục sản phẩm đã xóa mềm
export const restoreProduct = CatchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  product.isDeleted = false;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Sản phẩm đã được khôi phục",
  });
});
export const getAllProductsisDelete = CatchAsync(async (req, res, next) => {
  // Sao chép req.query và loại bỏ các trường không cần thiết
  const queryObj = { ...req.query };

  // Loại bỏ các trường không cần thiết
  const excludedFields = ["page", "sort", "limit", "fields", "id"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Thêm điều kiện cho isDeleted (bao gồm cả true và false)
  console.log(queryObj);

  // Xử lý toán tử tìm kiếm theo biểu thức chính quy
  if (req.query.title) {
    queryObj.title = { $regex: req.query.title, $options: "i" };
  }

  // Chuyển đổi các toán tử thành cú pháp MongoDB (vd: gte -> $gte)
  let queryString = JSON.stringify(queryObj);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt|in|ne)\b/g,
    (value) => `$${value}`
  );

  // Tạo truy vấn cơ bản
  let query = Product.find(JSON.parse(queryString));

  // Xử lý sắp xếp
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" "); // Chuyển "price,rating" thành "price rating"
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt"); // Mặc định sắp xếp theo createdAt giảm dần
  }

  const countproduct = await Product.countDocuments(query);

  // Giới hạn trường dữ liệu trả về từ truy vấn
  if (req.query.fields) {
    const fields = req.query.fields.replace(/,/g, " "); // Chuyển danh sách trường từ dạng "name,price" thành "name price"
    query = query.select(fields);
  }

  // Thực hiện truy vấn
  const products = await query;

  // Phản hồi kết quả
  res.status(201).json({
    success: true,
    productLength: products.length,
    products,
    countproduct,
  });
});

// 1. Thêm biến thể mới (màu sắc)
export const addVariant = CatchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const { color, sizes } = req.body;

  // Validate input
  if (!color || !sizes || !Array.isArray(sizes)) {
    return next(new HandelError("Vui lòng cung cấp đầy đủ thông tin", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  // Kiểm tra màu đã tồn tại
  const colorExists = product.variants.some(
    (v) => v.color.toLowerCase() === color.toLowerCase()
  );
  if (colorExists) {
    return next(new HandelError(`Màu ${color} đã tồn tại trong sản phẩm`, 400));
  }

  // Thêm biến thể mới
  product.variants.push({
    color,
    sizes: sizes.map((s) => ({
      size: s.size,
      quantity: s.quantity || 0,
      price: s.price,
    })),
  });

  await product.save();

  res.status(200).json({
    success: true,
    message: "Thêm biến thể mới thành công",
    variant: product.variants[product.variants.length - 1],
  });
});

// 2. Cập nhật biến thể
export const updateVariant = CatchAsync(async (req, res, next) => {
  const { productId, variantId } = req.params;
  const { color, sizes } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  const variantIndex = product.variants.findIndex(
    (v) => v._id.toString() === variantId
  );
  if (variantIndex === -1) {
    return next(new HandelError("Không tìm thấy biến thể", 404));
  }

  // Kiểm tra trùng màu nếu có thay đổi màu
  if (color && color !== product.variants[variantIndex].color) {
    const colorExists = product.variants.some(
      (v) =>
        v.color.toLowerCase() === color.toLowerCase() &&
        v._id.toString() !== variantId
    );
    if (colorExists) {
      return next(
        new HandelError(`Màu ${color} đã tồn tại trong sản phẩm`, 400)
      );
    }
    product.variants[variantIndex].color = color;
  }

  // Cập nhật sizes nếu có
  if (sizes && Array.isArray(sizes)) {
    product.variants[variantIndex].sizes = sizes.map((s) => ({
      size: s.size,
      quantity: s.quantity,
      price: s.price,
    }));
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Cập nhật biến thể thành công",
    variant: product.variants[variantIndex],
  });
});

// 3. Xóa biến thể
export const deleteVariant = CatchAsync(async (req, res, next) => {
  const { productId, variantId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  const variantIndex = product.variants.findIndex(
    (v) => v._id.toString() === variantId
  );
  if (variantIndex === -1) {
    return next(new HandelError("Không tìm thấy biến thể", 404));
  }

  product.variants.splice(variantIndex, 1);
  await product.save();

  res.status(200).json({
    success: true,
    message: "Xóa biến thể thành công",
  });
});

// 4. Cập nhật số lượng trong kho
export const updateInventory = CatchAsync(async (req, res, next) => {
  const { productId, variantId, sizeId } = req.params;
  const { quantity } = req.body;

  if (quantity < 0) {
    return next(new HandelError("Số lượng không thể âm", 400));
  }

  const product = await Product.findById(productId);
  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }

  const variant = product.variants.id(variantId);
  if (!variant) {
    return next(new HandelError("Không tìm thấy biến thể", 404));
  }

  const size = variant.sizes.id(sizeId);
  if (!size) {
    return next(new HandelError("Không tìm thấy kích thước", 404));
  }

  size.quantity = quantity;
  await product.save();

  res.status(200).json({
    success: true,
    message: "Cập nhật số lượng thành công",
    inventory: size,
  });
});
