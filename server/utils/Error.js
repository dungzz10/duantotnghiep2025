// a tạo một lớp HandelError để giúp dễ dàng tạo lỗi tùy chỉnh với thông điệp và mã trạng thái.

class HandelError extends Error {
	constructor(message, statusCode) {
		super(message)

		this.statusCode = statusCode
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"
		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = HandelError