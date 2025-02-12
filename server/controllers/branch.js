import Branch from "../models/branch.js";
import Product from "../models/productModel.js";
import BranchSchema from "../validates/branch.js";

export const getAllBranch = async (req, res) => {
    try {
        const categories = await Branch.find().populate("Product");
        if (categories.length === 0) {
            return res.json({
                message: "Không có thương hiệu nào",
            });
        }
        return res.status(200).json({ 
            message: "thành công",
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const getOneBranch = async function (req, res) {
    try {
        const Branch = await Branch.findById(req.params.id).populate("Product");
        if (!Branch) {
            return res.json({
                message: "Không có thương hiệu nào",
            });
        }
        return res.status(200).json({
            message: "thành công",
            data: Branch
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const createBranch = async function (req, res) {
    try {
        const { error } = BranchSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(404).json({
                message: errors,
            });
        }
        const { name } = req.body
        const BranchExists = await Branch.findOne({ name });
        if (BranchExists) {
            return res.status(404).json({
                message: "thương hiệu đã tồn tại",
            });
        }
        const Branch = await Branch.create(req.body);
        if (!Branch) {
            return res.status(404).json({
                message: "Không thêm được thương hiệu",
            });
        }
        return res.status(200).json({
            message: "Thêm thương hiệu thành công",
            data: Branch
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const updateBranch = async function (req, res) {
    try {
        const { name } = req.body
        const BranchExists = await Branch.findOne({ name });
        if (BranchExists) {
            return res.status(404).json({
                message: "thương hiệu đã tồn tại",
            });
        }
        const Branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!Branch) {
            return res.status(404).json({
                message: "Cập nhật thương hiệu không thành công",
            });
        }
        return res.status(200).json({
            message: "Cập nhật thương hiệu thành công",
            data: Branch
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const removeBranch = async function (req, res) {
    try {
        // Xoá thương hiệu và sản phẩm liên quan
        const categories = await Branch.findByIdAndDelete(req.params.id)
        if (!categories) {
            return res.status(404).json({
                message: "Xóa thương hiệu thất bại",
            });
        } else {
            const product = await Product.deleteMany({ BranchId: req.params.id })
            if (!product) {
                return res.status(404).json({
                    message: "Xóa sản phẩm liên quan thất bại",
                });
            } else {
                return res.status(200).json({
                    message: "Đã xoá thương hiệu và sản phẩm liên quan thành công!",
                });
            }
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
