import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../app/hook/LoadUser";

const LayoutClient = () => {
  const { user, isloading } = useUser();
   console.log(user);
  if (isloading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="containerCustom">
        <Header user={user}></Header>
        <Outlet></Outlet>
        <Footer></Footer>
      </div>
    </>
  );
};

export default LayoutClient;
