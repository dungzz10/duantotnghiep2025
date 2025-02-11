import React from "react";
import { Outlet } from "react-router-dom";

const PageContain = () => {
  return (
    <div className="pl-12">
      <Outlet />
    </div>
  );
};

export default PageContain;
