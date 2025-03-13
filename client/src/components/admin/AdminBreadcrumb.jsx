import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const breadcrumbNameMap = {
  "/admin/dashboard": "Dashboard",
  "/admin/orders": "Đơn hàng",
  "/admin/products": "Sản phẩm",
  "/admin/danh-muc": "Danh mục",
  "/admin/warehouse": "Kho hàng",
  "/admin/banners": "Banners",
  "/admin/customers": "Khách hàng",
  "/admin/useradmin": "Người dùng",
  "/admin/settings": "Cài đặt",
  "/admin/lien-he": "Liên hệ",
};

const AdminBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return {
      title: <Link to={url}>{breadcrumbNameMap[url] || "Trang"}</Link>,
    };
  });

  return (
    <Breadcrumb separator=">" items={[{ title: <Link to="/admin/dashboard">Home</Link> }, ...breadcrumbItems]} />
  );
};

export default AdminBreadcrumb;
