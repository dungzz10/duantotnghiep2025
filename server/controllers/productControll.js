const Product = require("../models/productModel");
const CatchAsync = require("../utils/CatchAsync");
const HandelError = require("../utils/Error");
const User = require("../models/usersModel");
// tao san pham moi
exports.createProduct = catchAsync(async (req, res, next) => {
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
