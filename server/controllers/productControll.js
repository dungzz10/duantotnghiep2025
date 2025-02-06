const Product = require("../models/productModel");
const CatchAsync = require("../utils/CatchAsync");
const HandelError = require("../utils/Error");
const User = require("../models/usersModel");
// tao san pham moi
exports.createProduct = CatchAsync(async (req, res, next) => {
  console.log(req.user);
  const productData = req.body;
  console.log(productData);
  console.log(req.user);
  productData.user = req.user.id;
  const product = new Product(productData);
  await product.save();
  const user = await User.findById(req.user.id);
  user.numProducts += 1;
  await user.save();
  res.status(201).json({
    success: true,
    product,
  });
  //
});
exports.getAllProduct = CatchAsync(async (req, res, next) => {
  // Sao chép req.query và loại bỏ các trường không cần thiết
  const queryObj = { ...req.query };
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
  // Thực hiện truy vấn
  const products = await query;

  // Phản hồi kết quả
  res.status(201).json({
    success: true,
    productLength: products.length,
    products,
    countproduct,
    totalPages,
  });
});
exports.getOneProducts = CatchAsync(async (req, res, next) => {
  


  
});
