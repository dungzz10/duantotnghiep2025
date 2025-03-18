import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../features/404/NotFoundPage";
import HomePage from "../features/HomePage";
import AboutPage from "../features/about/AboutPage";
import MomoSuccess from "../features/momo/MomoSuccess";
import Dashboard from "../features/admin/dashboard/dashboard";
import Iventory from "../features/admin/inventory/Iventory";
import Order from "../features/admin/orders/Order";
import BranchPage from "../features/branch/BranchPage";
import CartPage from "../features/cart/CartPage";
import CheckoutPage from "../features/cart/CheckoutPage";
import EmptyCart from "../features/cart/EmptyCart";
import ContactPage from "../features/contacts/ContactPage";
import ForgotPassword from "../features/forgotpassword/ForgotPasswordPage";
import Login from "../features/login/Login";
import ProductPage from "../features/product/ProductPage";
// import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import ProductNewsPage from "../features/productnews/ProductNewsPage";
import ProductSalePage from "../features/productsale/ProductSalePage";
import ProfilePage from "../features/profile/ProfilePage";
import ResetPassword from "../features/resetpassword/ResetPassword";
import Register from "../features/signup/Register";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutClient from "../layouts/LayoutClient";

import ListCategoriesAdmin from "../features/admin/categories/listcategoriesadmin/ListCategoriesAdmin";
import UppdateCategoriesAdmin from "../features/admin/categories/uppdatecategoriesadmin/UppdateCategoriesAdmin";
import ListUserAdmin from "../features/admin/customers/listuseradmin/ListUserAdmin";
import UppdateUserAdmin from "../features/admin/customers/uppdateuseradmin/UppdateUserAdmin";
import LoginAdmin from "../features/admin/login/LoginAdmin";
import ProductsAdmin from "../features/admin/products/addProductadmin/Productsadmin";
import ListproductAdmin from "../features/admin/products/listProductadmin/ListproductAdmin";
import UppdateProductAdmin from "../features/admin/products/uppdateproductadmin/UppdateProductAdmin";
import SignupAdmin from "../features/signup/SignupAdmin";
import ListBanner from "../features/admin/banners/listBannerAdmin/ListBanner";
import UserDetail from "../features/admin/customers/userdetail/UserDetail";
import AddBanner from "../features/admin/banners/addBannerAdmimn/AddBanner";
import OrderHistory from "../features/OrderHistory/OrderHistory";
import PaymentSuccess from "../features/OrderHistory/PaymentSuccess";
import ATMSuccess from "../features/OrderHistory/AtmSuccess";
import EditBanner from "../features/admin/banners/updateBanner/updateBanner";
import Search from "../features/search/Search";
import UserAdminList from "../features/admin/adminer/listadmin/UserAdminList";
import AddCategoriesAdmin from "../features/admin/categories/addcategoriesadmin/AddCategoriesAdmin";
import FavouritePage from "../features/favourite/FavouritePage";
import ProductDetailAdmin from "../features/admin/products/productdetail/ProductDetailAdmin";
import NoOrderPage from "../features/cart/NoOrderPage";
import Warehouse from "../features/admin/warehouse/Warehouse";
import SingelProduct from "../features/productdetail/SingelProduct";
import CategoriesPage from "../features/categories/CategoriesPage";
import ContactAdmin from "../features/admin/contact/ContactAdmin";
import Addadress from "../features/adress/Addadress";

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
        path: "/adress",
        element: <Addadress />,
      },
      {
        path: "/momo-success",
        element: <MomoSuccess />,
      },

      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/favourite",
        element: <FavouritePage />,
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
        element: <SingelProduct />,
      },
      {
        path: "/gioi-thieu",
        element: <AboutPage />,
      },

      {
        path: "/lien-he",
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
        path: "/no-order",
        element: <NoOrderPage />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/atm-success",
        element: <ATMSuccess />,
      },
      {
        path: "/order",
        element: <OrderHistory />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/user/profile",
        element: <ContactPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/danh-muc/:id",
        element: <CategoriesPage />,
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
      //============= bảng dashboard ===============
      { path: "dashboard", element: <Dashboard /> },

      //============= bảng inventory ===============
      { path: "inventory", element: <Iventory /> },

      //============= bảng orders ===============
      { path: "orders", element: <Order /> },

      //============= bảng danh-muc ===============
      { path: "danh-muc", element: <ListCategoriesAdmin /> },
      { path: "them-danh-muc", element: <AddCategoriesAdmin /> },
      { path: "sua-danh-muc/:id", element: <UppdateCategoriesAdmin /> },

      //============= bảng lien-he ===============
      { path: "lien-he", element: <ContactAdmin /> },

      //============= bảng kho hàng ===============
      { path: "warehouse", element: <Warehouse /> },

      //============= bảng user ===============
      { path: "customers", element: <ListUserAdmin /> },
      { path: "adduseradmin", element: <SignupAdmin /> },
      { path: "edit/:userId", element: <UppdateUserAdmin /> },
      { path: "detail/:userId", element: <UserDetail /> },

      //============= bảng admin ===============
      { path: "useradmin", element: <UserAdminList /> },

      //============= bảng product ===============
      { path: "products", element: <ListproductAdmin/>},
      { path: "addproductadmin", element: <ProductsAdmin /> },
      { path: "update/:id", element: <UppdateProductAdmin /> },
      { path: "products/detail/:id", element: <ProductDetailAdmin /> },

      //============= bảng banners ===============
      { path: "banners", element: <ListBanner /> },
      { path: "add-banner", element: <AddBanner /> },
      { path: "edit-banner/:id", element: <EditBanner /> },
    ],
  },
  { path: "/admin/loginadmin", element: <LoginAdmin /> },
]);
