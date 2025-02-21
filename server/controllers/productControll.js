import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
import User from "../models/usersModel.js";
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

  // Gán ID người dùng vào sản phẩm
  productData.user = req.user.id;

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

  // Cập nhật số lượng sản phẩm của người dùng
  // const user = await User.findById(req.user.id);
  // user.numProducts += 1;
  // await user.save();

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
export const getSingleProducts = CatchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandelError("Không tìm thấy sản phẩm", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});
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
