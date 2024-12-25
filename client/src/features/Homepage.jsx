import React from "react";

import Banner from "../components/Banner";
import Categories from "../components/Categories";
import Products from "./product/Products";

const HomePage = () => {
  return (
    <div>
      <Banner></Banner>
      <Categories></Categories>
      <Products></Products>
    </div>
  );
};

export default HomePage;
