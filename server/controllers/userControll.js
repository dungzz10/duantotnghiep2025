import User from "../models/usersModel.js";
import CatchAsync from "../utils/CatchAsync.js";
import HandelError from "../utils/Error.js";
import Order from "../models/orderModel.js";
// uppdate user
export const uppdateMe = CatchAsync(async (req, res, next) => {
  // Kiểm tra nếu client cố gắng thay đổi mật khẩu
  if (req.body.password) {
    return next(
      new HandelError("Vui lòng sử dụng API đổi mật khẩu riêng", 400)
    );
  }

  // Kiểm tra email trùng một cách chặt chẽ hơn
  if (req.body.email) {
    const emailExists = await User.findOne({
      email: req.body.email.toLowerCase(), // Chuyển email về lowercase
      _id: { $ne: req.user.id },
    });

    if (emailExists) {
      return next(
        new HandelError("Email này đã được sử dụng bởi tài khoản khác", 400)
      );
    }
  }

  // Kiểm tra tên nếu được cập nhật
  if (req.body.name) {
    if (req.body.name.length < 2 || req.body.name.length > 50) {
      return next(new HandelError("Tên phải từ 2 đến 50 ký tự", 400));
    }
  }

  // Cho phép cập nhật các trường này
  const allowedFields = ["name", "email", "photo", "address", "introduction","phoneNumber"];
  const updateData = {};

  // Lọc và xử lý các trường được phép cập nhật
  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      // Với email, luôn chuyển về lowercase
      if (field === "email") {
        updateData[field] = req.body[field].toLowerCase();
      } else {
        updateData[field] = req.body[field];
      }
    }
  });

  // Cập nhật thông tin người dùng với validation
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  res.status(200).json({
    success: true,
    message: "Cập nhật thông tin thành công!",
    data: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      photo: updatedUser.photo,
      introduction: updatedUser.introduction,
      address: updatedUser.address,
      phoneNumber:updatedUser.phoneNumber
    },
  });
});

// get one user  by id
export const getOneUser = CatchAsync(async (req, res, next) => {
  console.log("abd", req.params.userId);
  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new HandelError("khong tim thay user cua ban", 400));
  }
  res.status(200).json({
    success: true,
    user,
  });
});
// deaxtive user
export const deactiveUser = CatchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  console.log("Deactivating user with ID:", userId);

  // Cập nhật trạng thái của người dùng
  const user = await User.findByIdAndUpdate(
    userId,
    { active: false },
    { new: true, runValidators: true }
  );

  // Nếu không tìm thấy người dùng, trả lỗi
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng với ID này", 404));
  }

  // Trả phản hồi thành công
  res.status(200).json({
    success: true,
    message: "Người dùng đã bị vô hiệu hóa",
    user,
  });
});

export const getCustomerDetails = CatchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  // Lấy thông tin chi tiết của người dùng
  const user = await User.findById(userId)
    .select(
      "name email photo role introduction createdAt wallet address withdrawalAccounts"
    )
    .lean();

  if (!user) {
    return next(new HandelError("Không tìm thấy thông tin khách hàng", 404));
  }

  // Lấy danh sách đơn hàng của người dùng
  const orders = await Order.find({ userId })
    .populate({
      path: "products.productId",
      select: "title image price category condition",
    })
    .sort({ date: -1 })
    .lean();

  // Kiểm tra và chuyển đổi dữ liệu giao dịch
  const transactions =
    user.wallet?.transactions?.map((t) => ({
      ...t,
      status:
        {
          pending: "Đang xử lý",
          completed: "Thành công",
          failed: "Thất bại",
        }[t.status] || t.status,
      type:
        {
          momo_naptien: "Nạp tiền MoMo",
          deposit: "Nạp tiền",
          muahang: "Mua hàng",
        }[t.type] || t.type,
    })) || [];

  // Sắp xếp giao dịch theo thời gian mới nhất
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Chuyển đổi dữ liệu đơn hàng
  const transformedOrders = orders.map((order) => ({
    orderId: order.orderId,
    date: order.date,
    status: order.orderStatus,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    amount: order.amount,
    shippingFee: order.shippingFee,
    finalTotal: order.finalTotal,
    products: order.products.map((product) => ({
      productId: product.productId?._id,
      title: product.productId?.title,
      image: product.productId?.image,
      price: product.price,
      quantity: product.quantity,
      color: product.color,
      size: product.size,
      totalPrice: product.totalPrice,
    })),
  }));

  // Trả về kết quả với kiểm tra null
  res.status(200).json({
    success: true,
    data: {
      name: user.name,
      email: user.email,
      photo: user.photo,
      role: user.role,
      introduction: user.introduction,
      createdAt: user.createdAt,
      wallet: {
        balance: user.wallet?.balance || 0,
        transactionCount: transactions.length,
        transactions: transactions,
      },
      address:
        user.address?.map((a) => ({
          address: a.address,
          addressType: a.addressType,
        })) || [],
      withdrawalAccounts: user.withdrawalAccounts || [],
      orders: {
        total: transformedOrders.length,
        items: transformedOrders,
      },
    },
  });
});
export const addUserAdmin = CatchAsync(async (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return next(
      new HandelError("Bạn không có quyền thực hiện hành động này", 403)
    );
  }

  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user", // Mặc định vai trò là 'user' nếu không cung cấp
  });

  res.status(201).json({
    success: true,
    message: "Tạo tài khoản thành công",
    data: user,
  });
});
export const deactivateUserAdmin = CatchAsync(async (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return next(
      new HandelError("Bạn không có quyền thực hiện hành động này", 403)
    );
  }

  const userId = req.params.userId;

  // Kiểm tra người dùng có tồn tại không
  const user = await User.findById(userId);
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  // Vô hiệu hóa người dùng
  if (user.role === "superadmin") {
    return next(new HandelError("Không thể vô hiệu hóa superadmin", 403));
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { active: false },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Vô hiệu hóa tài khoản thành công",
    data: updatedUser,
  });
});
export const updateUserAdmin = CatchAsync(async (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return next(
      new HandelError("Bạn không có quyền thực hiện hành động này", 403)
    );
  }

  const { userId } = req.params;

  // Kiểm tra người dùng có tồn tại không
  const user = await User.findById(userId);
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  // Kiểm tra tài khoản cần cập nhật là admin
  if (user.role !== "admin") {
    return next(
      new HandelError("Chỉ có tài khoản admin mới có thể được cập nhật", 403)
    );
  }

  // Chỉ cho phép cập nhật các trường nhất định
  const allowedFields = ["name", "email", "photo", "introduction"];
  const updateData = {};

  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      updateData[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Cập nhật tài khoản admin thành công",
    data: updatedUser,
  });
});
export const getMyAddresses = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("address");

  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  res.status(200).json({
    success: true,
    addresses: user.address, 
  });
});
export const addAddress = CatchAsync(async (req, res, next) => {
  const { address, addressType } = req.body;

  if (!address || !addressType) {
    return next(new HandelError("Vui lòng nhập đầy đủ thông tin địa chỉ!", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }
  const addressExists = user.address.some(
    (item) => item.address === address && item.addressType === addressType
  );

  if (addressExists) {
    return res.status(400).json({
      success: false,
      message: "Địa chỉ này đã tồn tại.",
    });
  }

  user.address.push({ address, addressType });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Thêm địa chỉ thành công!",
    addresses: user.address,
  });
});
export const updateAddress = CatchAsync(async (req, res, next) => {
  const { id, address, addressType } = req.body;
  console.log(req.body)

  if (!id || !address || !addressType) {
    return next(new HandelError("Vui lòng cung cấp đầy đủ thông tin", 400));
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  const addressIndex = user.address.findIndex((a) => a._id.toString() === id);
  if (addressIndex === -1) {
    return next(new HandelError("Không tìm thấy địa chỉ", 404));
  }

  user.address[addressIndex] = { address, addressType };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Cập nhật địa chỉ thành công!",
    addresses: user.address,
  });
});
export const deleteAddress = CatchAsync(async (req, res, next) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new HandelError("Không tìm thấy người dùng", 404));
  }

  const addressIndex = user.address.findIndex((a) => a._id.toString() === addressId);
  if (addressIndex === -1) {
    return next(new HandelError("Không tìm thấy địa chỉ", 404));
  }

  user.address.splice(addressIndex, 1);

  await user.save();

  res.status(200).json({
    success: true,
    message: "Xóa địa chỉ thành công!",
    addresses: user.address,
  });
});



