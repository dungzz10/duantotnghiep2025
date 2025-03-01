import joi from "joi";
const categorySchema = joi.object({
    name: joi.string().required().messages({
        "string.empty": 'Trường tên không được để trống',
        "any.required": 'Trường tên là bắt buộc',
    }),
    image: joi.string().uri().optional().messages({
        "string.empty": 'Trường hình ảnh không được để trống',
        "any.required": 'Trường hình ảnh là bắt buộc',
    })
});

export default categorySchema 