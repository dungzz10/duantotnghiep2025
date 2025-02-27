import React from "react";
import { Space } from "antd";
import AppHeafer from "../components/admin/AppHeafer";
import SideMEnu from "../components/admin/SideMEnu";
import PageContain from "../components/admin/PageContain";
import AppFooter from "../components/admin/AppFooter";

import { useAdmin } from "../app/hook/LoadAdmin";
const LayoutAdmin = () => {
  const { admin, isloading } = useAdmin();
  console.log(admin);
  if (isloading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col h-screen w-full min-h-screen px-auto containerCustom">
      <AppHeafer admin={admin}></AppHeafer>
      {/* <Space className="flex flex-grow"> */}

      {["admin", "superadmin"].includes(admin?.role) ? (
        <SideMEnu />
      ) : (
        <div className="flex h-screen">
          bạn cần phải đăng nhập để thực hiện hành động
        </div>
      )}

      {/* <PageContain></PageContain> */}
      {/* </Space> */}
      {/* <AppFooter></AppFooter> */}
    </div>
  );
};

export default LayoutAdmin;
