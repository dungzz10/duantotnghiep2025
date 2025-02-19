import React from "react";
import { Space } from "antd";
import AppHeafer from "../components/admin/AppHeafer";
import SideMEnu from "../components/admin/SideMEnu";
import PageContain from "../components/admin/PageContain";
import AppFooter from "../components/admin/AppFooter";
const LayoutAdmin = () => {
  return (
    <div className="flex flex-col h-screen w-full min-h-screen px-auto containerCustom">
      <AppHeafer></AppHeafer>
      {/* <Space className="flex flex-grow"> */}
        <SideMEnu></SideMEnu>
        {/* <PageContain></PageContain> */}
      {/* </Space> */}
      <AppFooter></AppFooter>
    </div>
  );
};

export default LayoutAdmin;
