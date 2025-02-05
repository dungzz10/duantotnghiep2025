import React from 'react'

const Footer = () => {
  return (
    <footer className="footer section bg-neutral text-neutral-content p-10">
  <nav>
    <h6 className="footer-title">Dịch vụ</h6>
    <a className="link link-hover">Xây dựng thương hiệu</a>
    <a className="link link-hover">Thiết kế</a>
    <a className="link link-hover">Tiếp thị</a>
    <a className="link link-hover">Quảng cáo</a>
  </nav>
  <nav>
    <h6 className="footer-title">Công ty</h6>
    <a className="link link-hover">Về chúng tôi</a>
    <a className="link link-hover">Liên hệ</a>
    <a className="link link-hover">Việc làm</a>
    <a className="link link-hover">Bộ báo chí</a>
  </nav>
  <nav>
    <h6 className="footer-title">Hợp pháp</h6>
    <a className="link link-hover">Điều khoản sử dụng</a>
    <a className="link link-hover">Chính sách bảo mật</a>
    <a className="link link-hover">Chính sách đổi trả</a>
  </nav>
</footer>
  )
}

export default Footer