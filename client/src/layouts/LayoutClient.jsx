import React from "react";
import { Outlet } from "react-router-dom";

const LayoutClient = () => {
  return (
    <>
      <div className="containerCustom">
        <Outlet></Outlet>
      </div>
    </>
  );
};

export default LayoutClient;
