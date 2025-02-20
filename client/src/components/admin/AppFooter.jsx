import { Typography } from "antd";
import React from "react";

const AppFooter = () => {
  return (
    <div className="containerCustom h-[50px] flex justify-between items-center border-t-gray-100 fixed bottom-0 w-full bg-white">
      <Typography.Link href="tell:+0123456789">+0123456789</Typography.Link>
      <Typography.Link href="mailto:dunghqph33551@fpt.edu.vn" target="_blank">
        dunghqph33551@fpt.edu.vn
      </Typography.Link>
      <Typography.Link href="#">team of use</Typography.Link>
    </div>
  );
};

export default AppFooter;
