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
    <div className="flex flex-col min-h-screen">
      <Header user={user} />

      <Wrapper className="flex-grow">
        <Outlet />
      </Wrapper>

      <Footer />
    </div>
  );
};

export default LayoutClient;
