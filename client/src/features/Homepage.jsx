import React from "react";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Products from "./product/Products";
import BannerFooter from "../components/BannerFooter";
// import { useUser } from "../app/hook/LoadUser";

const HomePage = () => {
 
  return (
    <div>
      <Banner></Banner>
      <BannerFooter></BannerFooter>
      <Categories></Categories>
      <Products></Products>
    </div>
  );
};

export default HomePage;
