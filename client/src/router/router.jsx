import { createBrowserRouter } from "react-router-dom";
import LayoutClient from "../layouts/LayoutClient";
import LayoutAdmin from "../layouts/LayoutAdmin";
import HomePage from "../features/HomePage";
import Login from "../features/login/Login";
import NotFoundPage from "../features/404/NotFoundPage";
import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import SignupPage from "../features/signup/SignupPage";
import AboutPage from "../features/about/AboutPage";
import ContactPage from "../features/contacts/ContactPage";
import ProductPage from "../features/product/ProductPage";
import CartPage from "../features/cart/CartPage";
import Register from "../features/signup/Register";
import CheckoutPage from "../features/cart/CheckoutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutClient />, // Layout dành cho người dùng
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/products/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      }, ,
      {
        path: "/cart",
        element: <CartPage />,
      }, ,
      {
        path: "/cart/checkout",
        element: <CheckoutPage />,
      }, ,
      {
        path: "/user/profile",
        element: <ContactPage />,
      }, ,
      {
        path: "/contact",
        element: <ContactPage />,
      },
    ],
  },
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />, // Layout dành cho admin
    children: [

      // {
      //   path: "*",
      //   element: <NotFoundPage />,
      // },
    ],
  },
]);
