import React from "react";
import { Outlet } from "react-router-dom";

const PageContain = () => {
  return (
    <div className="pl-5">
      <Outlet />
    </div>
  );
};

export default PageContain;
