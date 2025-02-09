import React from "react";
import { Link } from "react-router-dom";
import { userLogout } from "../app/hook/LogoutUser";
import { ShoppingCart } from "lucide-react";

const Header = ({ user }) => {
  const { Logout } = userLogout();
  // console.log("User:", userLogout);

  const handleLogout = () => {
    console.log("Logout");
    Logout();
  };

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="https://via.placeholder.com/40"
              className="mr-3 h-6 sm:h-9"
              alt="Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              LOGO
            </span>
          </Link>

          {/* USER SECTION */}
          <div className="flex items-center lg:order-2">
            {user ? (
              <div className="dropdown dropdown-end z-20">
                {/* Avatar (Button để mở dropdown) */}
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img src={user.photo || "https://via.placeholder.com/40"} alt="User Avatar" />
                  </div>
                </div>

                {/* Dropdown Menu */}
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/my-store?tab=products">My Store</Link>
                  </li>
                  <li>
                    <Link to="/payment-management">Payment Management</Link>
                  </li>
                  <li>
                    <Link to="/address">Address</Link>
                  </li>
                  <li>
                    <Link to="/order">Orders</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="text-red-600">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/signin" className="btn white mr-1">
                  Login
                </Link>
                <Link to="/signup" className="btn white">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* MENU CHÍNH */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            <Link to="/" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Trang chủ
            </Link>
            <Link to="/products" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Sản phẩm
            </Link>
            <Link to="/accessory" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Phụ kiện
            </Link>
            <Link to="/product/sale" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Giảm giá
            </Link>
            <Link to="/product/new" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Mới ra mắt
            </Link>
            <Link to="/branch" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Thương hiệu
            </Link>
            <Link to="/about" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Giới thiệu
            </Link>
            <Link to="/contact" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              Liên hệ
            </Link>
            <Link to="/cart" className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700">
              <ShoppingCart size={20} />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
