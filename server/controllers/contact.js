import Contact from "../models/contact.js";
import { sendEmail } from "../utils/nodemail.js";
import contactSchema from "../validates/contact.js";
export const getAllContact = async (req, res) => {
    try {
        const contact = await Contact.find()
        if (contact.length === 0) {
            return res.status(404).json({
                message: "Không có liên hệ nào",
            });
        }
        return res.status(200).json({
            message: "thành công", 
            data: contact
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export const getOneContact = async function (req, res) {
    try {
        const contact = await Contact.findById(req.params.id)
        if (!contact) {
            return res.status(404).json({
                message: "Không tìm thấy liên hệ",
            });
        }
        return res.status(200).json({
            message: "thành công",
            data: contact
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const createContact = async function (req, res) {
    try {
        const { error } = contactSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(404).json({
                message: errors,
            });
        }
        const contact = await Contact.create(req.body);
        if (!contact) {
            return res.status(404).json({
                message: "Không thể gửi liên hệ",
            });
        }
        return res.status(200).json({
            message: "gửi liên hệ thành công",
            data: contact,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
export const updateContact = async (req, res) => {
    try {
      const { name, email, phone, support ,message } = req.body;
      
      // Cập nhật liên hệ vào cơ sở dữ liệu
      const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      // Gửi email khi cập nhật
      const emailMessage = `Chúng tôi đã cập nhật yêu cầu của bạn. Dưới đây là thông tin liên hệ của bạn: \n
                            Tên: ${name} \n
                            Email: ${email} \n
                            Số điện thoại: ${phone} \n
                            Vấn đề hỗ trợ: ${support} \n
                            phản hồi : ${message}
                            `
                           
      await sendEmail(email, emailMessage);
  
      res.status(200).json({
        message: 'Cập nhật liên hệ thành công và email đã được gửi tới khách hàng',
        data: contact
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };
export const removeContact = async function (req, res) {
    console.log("abcdef",req.params.id);
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: "Xóa liên hệ thành công",
            contact,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};