import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../features/HomePage";
import Login from "../features/login/Login";
import NotFoundPage from "../features/404/NotFoundPage";
import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import SignupPage from "../features/signup/SignupPage";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contacts/ContactPage";
import ProductPage from "../features/product/ProductPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>, 
    children: [
      {
        path: "/",
        element: <HomePage /> 
      },
      {
        path: "/login",
        element: <Login /> 

      },
      {
        path: "/signup",
        element: <SignupPage /> 

      },
      {
        path: "/products",
        element: <ProductPage /> 

      },
      {
        path: `/products/:id`,
        element: <ProductDetailPage /> 

      },
      {
        path: "/about",
        element: <AboutPage /> 

      },
      {
        path: "/contact",
        element: <ContactPage /> 

      },
      {
        path: "*",
        element: <NotFoundPage /> 
      },
    ]
  }
]);
