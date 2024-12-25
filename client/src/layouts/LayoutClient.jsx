import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LayoutClient = () => {
  return (
    <>
      <div className="containerCustom">
        <Header></Header>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </>
  );
};

export default LayoutClient;
