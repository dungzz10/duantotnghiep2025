import { data, Link, useNavigate } from "react-router-dom";
import { userLogout } from "../app/hook/LogoutUser";
import React, { useEffect, useState } from "react";
import Wrapper from "./Wrapper";
import Menu from "./Menu";
import Banner from "./Banner";

import { Search, ShoppingBag, Heart, User } from "lucide-react";
import { api } from "../axios/api";
import { useUser } from "../app/hook/LoadUser";

const Header = () => {
  const { user, isLoading: isUserLoading, refetch } = useUser();
  console.log(user, "user");
  const [showCatMenu, setShowCatMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { Logout } = userLogout();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [totalFavourite, setTotalFavourite] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.get("/favourite/total");
      setTotalFavourite(data.data.totalFavourites);
      console.log(data.data.totalFavourites, 999);
    };

    if (user) {
      fetchData();
      refetch();
    }
  }, [user, refetch]);
  useEffect(() => {
    const fetchCartCount = async () => {
      const response = await api.get("/user/cart/count", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      });

      const count = response.data.totalQuantity;
      setCartItemCount(count);
    };
    if (user) {
      fetchCartCount();
      refetch();
    }

    fetchCartCount();
  }, [user, refetch]);

  const handleLogout = () => {
    console.log("Logout");
    Logout();
  };
  // if (isUserLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-white py-2 border-b">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Spacer giữ khoảng bằng kích thước dòng bị xoá */}
          <div className="w-[160px] hidden md:block" />

          <Link to="/" className="hidden md:block">
            <img
              src="/src/assets/theshoes.png"
              alt="Beautico"
              className="h-20"
            />
          </Link>

          <div className="flex items-center space-x-2">
            <div className="relative hidden md:flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-full px-4 py-1 pr-10 focus:outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <button
                className="absolute right-3"
                onClick={() => {
                  if (q.trim() !== "") {
                    navigate(`/search?q=${q}`);
                  }
                }}
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Category Button - Left Side */}
            <div className="flex items-center">
              {/* <div className="bg-black text-white px-4 py-2 flex items-center cursor-pointer">
                <span className="mr-2">☰</span>
                <span>Category</span>
              </div> */}
            </div>

            {/* Mobile Logo - Center */}
            <Link to="/" className="md:hidden">
              <img
                src="/src/assets/theshoes.png"
                alt="Beautico"
                className="h-12 ml-20"
              />
            </Link>

            {/* Main Menu - Center */}
            <div className="hidden md:block">
              <Menu showCatMenu={showCatMenu} setShowCatMenu={setShowCatMenu} />
            </div>

            {/* Icons - Right Side */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingBag size={22} />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              </Link>
              <Link to="/favourite" className="relative">
                <Heart size={22} />
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalFavourite}
                </span>
              </Link>

              {user ? (
                <div className="dropdown dropdown-end z-20">
                  <div tabIndex={0} role="button" className="cursor-pointer">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.photo || "https://via.placeholder.com/40"}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-100 rounded-box w-52 p-2 shadow"
                  >
                    <li>
                      <Link to="/profile">Profile</Link>
                    </li>
                    {/* <li>
                      <Link to="/my-store?tab=products">My Store</Link>
                    </li> */}
                    {/* <li>
                      <Link to="/payment-management">Payment Management</Link>
                    </li> */}
                    <li>
                      <Link to="/adress">Địa Chỉ </Link>
                    </li>
                    <li>
                      <Link to="/order">Đơn Hàng </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="text-red-600">
                        Đăng Xuất
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <Link to="/signin">
                  <User size={22} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      <div className="md:hidden w-full py-2 px-4 bg-gray-50">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-full px-4 py-1 pr-10 focus:outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="absolute right-3"
            onClick={() => {
              if (q.trim() !== "") {
                navigate(`/search?q=${q}`);
              }
            }}
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Hero Banner Section - Just for demonstration */}
      {/* <div className="relative">
        <div className="bg-gray-100 w-full h-[400px] flex">
          <div className="w-1/2 flex flex-col justify-center px-12">
            <div className="relative">
              <div className="bg-black text-white px-3 py-1 rounded-full inline-block">
                50% OFF
              </div>
              <h1 className="text-4xl font-bold mt-4">
                Glow Requires<br />Gradual Nurturing.
              </h1>
              <p className="mt-4">
                Whatever Your Summer Looks Like, Bring Your Own Heat With<br />
                Up To 25% Off Lumin Brand.
              </p>
              <button className="mt-6 bg-black text-white px-6 py-2">
                *Shop Now*
              </button>
            </div>
          </div>
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/banner.jpg')" }}>
           <Banner></Banner>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default Header;
