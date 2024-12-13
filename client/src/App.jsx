import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Heaader from "./components/Heaader";
import Carousel from "./components/Carousel";
import Categories from "./components/Categories";
import Card from "./feature/products/Card";
import Product from "./feature/products/Product";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="containerCustom">
      <Heaader></Heaader>
      <Carousel></Carousel>
      <Categories></Categories>
      <Product></Product>
      </div>
    </>
  );
}

export default App;
