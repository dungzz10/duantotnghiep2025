import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import categorySchema from "../validates/category.js";

export const getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories.length === 0) {
      return res.json({
        message: "Không có danh mục nào",
      });
    }
    return res.status(200).json({
      message: "thành công",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllCategorynoProduct = async (req, res) => {
  try {
    const categories = await Category.find({});
    if (categories.length === 0) {
      return res.json({
        message: "Không có danh mục nào",
      });
    }
    return res.status(200).json({
      message: "thành công",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getOneCategory = async function (req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.json({
        message: "Không có danh mục nào",
      });
    }
    return res.status(200).json({
      message: "thành công",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const createCategory = async function (req, res) {
  try {
    const { error } = categorySchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(404).json({
        message: errors,
      });
    }
    const { name } = req.body;
    console.log("name", name);
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(404).json({
        message: "danh mục đã tồn tại",
      });
    }
    console.log(req.body);
    const category = await Category.create(req.body);
    if (!category) {
      return res.status(404).json({
        message: "Không thêm được danh mục",
      });
    }
    return res.status(200).json({
      message: "Thêm danh mục thành công",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true } // This returns the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật danh mục",
      error: error.message,
    });
  }
};
export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find all products with this category
    const productsToDelete = await Product.find({ category: id });

    // Delete all products first
    await Product.deleteMany({ category: id });

    // Then delete the category
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh mục",
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa danh mục và ${productsToDelete.length} sản phẩm liên quan`,
      data: {
        category: deletedCategory,
        deletedProductsCount: productsToDelete.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server khi xóa danh mục",
      error: error.message,
    });
  }
};
