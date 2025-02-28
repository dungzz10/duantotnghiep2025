import React from "react";
import { Link, Outlet } from "react-router-dom";

const CategoriesAdmin = () => {
  return (
    <>
      <div className="flex">
        <div className="mr-4 border p-3">
          <Link
            className="text-blue-500 hover:text-blue-700"
            to="/admin/categories/listcategoriesadmin"
          >
            ListCategories
          </Link>
        </div>
        <div className="mr-4 border p-3">
          <Link className="text-blue-500 hover:text-blue-700" to='/admin/Categories/addcategoriesadmin'>AddCategories</Link>
        </div>
      </div>
      <Outlet></Outlet>
    </>
  );
};
export default CategoriesAdmin;