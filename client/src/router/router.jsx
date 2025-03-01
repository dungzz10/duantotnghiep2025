import { createBrowserRouter } from "react-router-dom";
import NotFoundPage from "../features/404/NotFoundPage";
import HomePage from "../features/HomePage";
import AboutPage from "../features/about/AboutPage";
import Customer from "../features/admin/customers/customer";
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
import ProductDetailPage from "../features/productdetail/ProductDetailPage";
import ProductNewsPage from "../features/productnews/ProductNewsPage";
import ProductSalePage from "../features/productsale/ProductSalePage";
import ProfilePage from "../features/profile/ProfilePage";
import ResetPassword from "../features/resetpassword/ResetPassword";
import Register from "../features/signup/Register";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutClient from "../layouts/LayoutClient";
import CategoriesAdmin from "../features/admin/categories/Categories";
import ListCategoriesAdmin from "../features/admin/categories/listcategoriesadmin/ListCategoriesAdmin";
import ListUserAdmin from "../features/admin/customers/listuseradmin/ListUserAdmin";
import UppdateUserAdmin from "../features/admin/customers/uppdateuseradmin/UppdateUserAdmin";
import LoginAdmin from "../features/admin/login/LoginAdmin";
import ProductAdminPage from "../features/admin/products/ProductAdminPage";
import ProductsAdmin from "../features/admin/products/addProductadmin/Productsadmin";
import ListproductAdmin from "../features/admin/products/listProductadmin/ListproductAdmin";
import UppdateProductAdmin from "../features/admin/products/uppdateproductadmin/UppdateProductAdmin";
import SignupAdmin from "../features/signup/SignupAdmin";
import ListBanner from "../features/admin/banners/listBannerAdmin/ListBanner";
import UserDetail from "../features/admin/customers/userdetail/UserDetail";
import AddBanner from "../features/admin/banners/addBannerAdmimn/AddBanner";
import OrderHistory from "../features/OrderHistory/OrderHistory";
import PaymentSuccess from "../features/OrderHistory/PaymentSuccess";
import EditBanner from "../features/admin/banners/updateBanner/updateBanner";
import UserAdminPage from "../features/admin/adminer/UserAdminPage";
import UserAdminList from "../features/admin/adminer/listadmin/UserAdminList";
import AddCategoriesAdmin from "../features/admin/categories/addcategoriesadmin/AddCategoriesAdmin";
<<<<<<< HEAD
import FavouritePage from "../features/favourite/FavouritePage";
=======
import UppdateCategoriesAdmin from "../features/admin/categories/uppdatecategoriesadmin/UppdateCategoriesAdmin";
>>>>>>> 2345b179fa7fe8f1fc8714322f57232e20a01646
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
        path: "/favourite ",
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
        element: <ProductDetailPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
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
        path: "/momo-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/order",
        element: <OrderHistory />,
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
      {
        path: "useradmin",
        element: <UserAdminPage />,
        children: [{ path: "listuseradmin", element: <UserAdminList /> }],
      },
      { path: "orders", element: <Order /> },
      {
        path: "categories",
        element: <CategoriesAdmin />,
        children: [
          { path: "listcategoriesadmin", element: <ListCategoriesAdmin /> },
          { path: "addcategoriesadmin", element: <AddCategoriesAdmin /> },
          { path: ":id/update", element: <UppdateCategoriesAdmin /> },
        ],
      },
      {
        path: "customers",
        element: <Customer />,
        children: [
          { path: "listuseradmin", element: <ListUserAdmin /> },
          { path: "adduseradmin", element: <SignupAdmin /> },
          { path: "edit/:userId", element: <UppdateUserAdmin /> },
          { path: "detail/:userId", element: <UserDetail /> },
        ],
      },
      {
        path: "products",
        element: <ProductAdminPage />,
        children: [
          { path: "addproductadmin", element: <ProductsAdmin /> },
          { path: "listproductadmin", element: <ListproductAdmin /> },
          { path: "update/:id", element: <UppdateProductAdmin /> },
        ],
      },
      //----------------------banner router----------------
      {
        path: "banners",
        element: <ListBanner />,
      },
      {
        path: "add-banner",
        element: <AddBanner />,
      },
      {
        path: "edit-banner/:id",
        element: <EditBanner />,
      },
    ],
  },
  { path: "/admin/loginadmin", element: <LoginAdmin /> },
]);
