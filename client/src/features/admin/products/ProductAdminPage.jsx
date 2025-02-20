import React from "react";
import { Link, Outlet } from "react-router-dom";

const ProductAdminPage = () => {
  return (
    <>
      <div className="flex">
        <div className="mr-4 border p-3">
          <Link
            className="text-blue-500 hover:text-blue-700"
            to="/admin/products/listproductadmin"
          >
            ListProducts
          </Link>
        </div>
        <div className="mr-4 border p-3">
          <Link className="text-blue-500 hover:text-blue-700" to='/admin/products/addproductadmin'>AddProducts</Link>
        </div>
      </div>
      <Outlet></Outlet>
    </>
  );
};
export default ProductAdminPage;
