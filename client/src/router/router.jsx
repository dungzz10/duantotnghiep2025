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
import AccessoryPage from "../features/accessory/AccessoryPage";
import ProductNewsPage from "../features/productnews/ProductNewsPage";
import BranchPage from "../features/branch/BranchPage";
import ProductSalePage from "../features/productsale/ProductSalePage";
import EmptyCart from "../features/cart/EmptyCart";
import ForgotPassword from "../features/forgotpassword/ForgotPasswordPage";
import ResetPassword from "../features/resetpassword/ResetPassword";
import ProfilePage from "../features/profile/ProfilePage";
import Dashboard from "../features/admin/dashboard/dashboard";
import Iventory from "../features/admin/inventory/Iventory";
import Order from "../features/admin/orders/Order";
import Customer from "../features/admin/customers/customer";

import LoginAdmin from "../features/admin/login/LoginAdmin";
import ListUserAdmin from "../features/admin/customers/listuseradmin/ListUserAdmin";
import SignupAdmin from "../features/signup/SignupAdmin";
import ProductAdminPage from "../features/admin/products/ProductAdminPage";
import ProductsAdmin from "../features/admin/products/addProductadmin/Productsadmin";
import Phukien from "../features/phukien/phukien";

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
        path: "/accessory",
        element: <AccessoryPage />,
      },
      {
        path: "/product/sale",
        element: <ProductSalePage />,
      },
      {
        path: "product/new",
        element: <ProductNewsPage />,
      },
      {
        path: "branch",
        element: <BranchPage />,
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
        path: "/phukien",
        element: <Phukien />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/cart",
        element: <CartPage />,
      },
      {
        path: "/cart/checkout",
        element: <CheckoutPage />,
      },
      {
        path: "/cart/emptycart",
        element: <EmptyCart />,
      },
      {
        path: "/user/profile",
        element: <ContactPage />,
      },
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
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPassword />,
  },
  {
    path: "/resetpassword/:resetToken",
    element: <ResetPassword />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/admin",
    element: <LayoutAdmin />, // Layout dành cho admin
    children: [
      { path: "dashboard", element: <Dashboard /> },

      { path: "inventory", element: <Iventory /> },
      { path: "orders", element: <Order /> },
      {
        path: "customers",
        element: <Customer />,
        children: [
          { path: "listuseradmin", element: <ListUserAdmin /> },
          { path: "adduseradmin", element: <SignupAdmin /> },
        ],
      },
      {
        path: "products",
        element: <ProductAdminPage />,
        children: [{ path: "addproductadmin", element: <ProductsAdmin /> }],
      },
    ],
  },
  { path: "/admin/loginadmin", element: <LoginAdmin /> },
]);
