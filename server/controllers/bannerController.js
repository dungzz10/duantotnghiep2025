 // Import model Banner
import Banner from "../models/bannerModel.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("image"); // Chỉ nhận 1 ảnh


//lấy toàn bộ banner 
export const getAllBanners = async(req,res) =>{
    try {
       const banners = await Banner.find().sort({createdAt: -1});
       if(banners.length === 0){
        return res.status(404).json({
            message: 'Không có banner nào trong danh sách'
        })
       }
       return res.status(200).json({
            message: 'Lấy danh sách banner thành công',
            banners: banners,
       })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//lấy banner theo id 
export const getBannerById = async(req,res) =>{
    try {
        const banner = await Banner.findById(req.params.id);
        if(!banner){
            return res.status(404).json({
                message: 'Không tìm thấy banner'
            })
        }return res.status(200).json({
            message: 'Lấy banner theo id thành công',
            data: banner 
        })
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

//Thêm banner mới 
export const createBanner = async(req,res) =>{
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: "Lỗi upload ảnh" });

        try {
            const { title, isActive } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: "Vui lòng chọn ảnh" });
            }

            // Upload ảnh lên Cloudinary
            const result = await cloudinary.uploader.upload_stream(
                { folder: "banners" }, // Lưu vào thư mục "banners"
                async (error, result) => {
                    if (error) {
                        return res.status(500).json({ message: "Upload ảnh thất bại" });
                    }

                    const banner = await Banner.create({ title, image: result.secure_url, isActive });
                    return res.status(201).json({ message: "Thêm banner thành công", data: banner });
                }
            );

            result.end(req.file.buffer); // Upload từ buffer
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    });
}

//cập nhật banner theo id
export const updateBanner = async (req,res) =>{
    try {
        const { error } = bannerSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const banner = await Banner.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!banner){
            return res.status(404).json({
                message: "Cập nhật banner không thành công",
            });
        } return res.status(200).json({
            message: "Cập nhật banner thành công",
            data: banner,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}

//xóa banner theo id
export const removeBanner = async (req,res) =>{
    try {
        const banner = await Banner.findByIdAndDelete(req.params.id);
        if(!banner){
            return res.status(404).json({
                message: "Không tìm thấy banner đẻ xóa"
            })
        }
        return res.status(200).json({
            message: 'xóa thành công',
            data:banner,
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
}