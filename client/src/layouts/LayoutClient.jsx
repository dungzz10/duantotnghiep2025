import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../app/hook/LoadUser";
import Wrapper from "../components/Wrapper";

const LayoutClient = () => {
  const { user, isloading } = useUser();
  console.log(user);
  if (isloading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Header user={user}></Header>
      <Wrapper>
        <Outlet></Outlet>
      </Wrapper>
      <Footer></Footer>
    </>
  );
};

export default LayoutClient;
