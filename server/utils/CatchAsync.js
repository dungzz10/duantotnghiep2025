// tránh việc phải viết try...catch ở mỗi hàm xử lý.
const catchAsync = (fn) => {
	return (req, res, next) => {
		fn(req, res, next).catch(next)
	}
}

export default catchAsync