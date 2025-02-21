import Banner from "../models/bannerModel.js"; // Import model Banner


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
            data: banners,
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
    try {
        const {error} = Banner.validate(req.body,{ abortEarly: false });
        if(error){
           const errors = error.details.map((err) =>err.message);
           return res.status(400).json({
            message:errors,
           })
        }
        const banner = await Banner.create(req.body);
        return res.status(201).json({
            message: 'Thêm banner thành công',
            data: banner
        })
    } catch (error) {
      return res.status(500).json({message: error.message})
    }
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