
import { Link } from "react-router-dom";
import { userLogout } from "../app/hook/LogoutUser";
import React, { useState } from 'react'
import Wrapper from "./Wrapper";

import { ShoppingCart } from "lucide-react";
import { IoMdHeartEmpty } from 'react-icons/io'
import { BsCart } from 'react-icons/bs'
import { BiMenuAltRight } from 'react-icons/bi'
import { VscChromeClose } from 'react-icons/vsc'
import Menu from "./Menu";
import MenuMobile from "./MenuMobile";


const Header = ({ user }) => {
  const [mobileMenu, setMobileMenu] = useState(false) // trạng thái menu cho mobile
  const [showCatMenu, setShowCatMenu] = useState(false) // trạng thái show menu


  const { Logout } = userLogout();
  // console.log("User:", userLogout);

  const handleLogout = () => {
    console.log("Logout");
    Logout();
  };

  return (
    <header className={`w-full h-[50px] md:h-[80px] bg-white flex items-center justify-between
    z-20 sticky top-0 transition-transform duration-300 
    `}>
      <Wrapper className="h-[60px] flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" >
          <img
            src="./src/assets/logo.svg"
            className="w-[40px] md:w-[60px]"
            alt="Logo"
          />
        </Link>

        {/* MENU CHÍNH */}
        <Menu
          showCatMenu={showCatMenu}
          setShowCatMenu={setShowCatMenu}
        />

        {mobileMenu && <MenuMobile
          showCatMenu={showCatMenu}
          setShowCatMenu={setShowCatMenu}
          setMobileMenu={setMobileMenu}
        />}

        {/* USER SECTION */}
        <div className="flex items-center lg:order-2">

          {/* Cart */}
          <div className='flex items-center gap-2 text-black'>
            {/* Icon start  */}
            <div className='w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center 
            items-center hover:bg-black/[0.05] cursor-pointer relative'>
              <Link to={'/favourite'}>
              <IoMdHeartEmpty className='text-[15px] md:text-[20px]' />
              <div className='h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px]
                rounded-full bg-red-600 text-white absolute top-1 left-5 md:left-7
                text-[10px] md:text-[12px] flex justify-center items-center px-[2px] 
                md:px-[5px]'>51</div>
                </Link>
            </div>
            {/* icon end  */}

            {/* Icon start  */}
            <Link to='/cart'>
              <div className='w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center 
            items-center hover:bg-black/[0.05] cursor-pointer relative'>
                <BsCart className='text-[15px] md:text-[20px]' />
                <div className='h-[14px] md:h-[18px] min-w-[14px] md:min-w-[18px]
                rounded-full bg-red-600 text-white absolute top-1 left-5 md:left-7
                text-[10px] md:text-[12px] flex justify-center items-center px-[2px] 
                md:px-[5px]'>5</div>
              </div>
            </Link>
            {/* icon end */}

            {/* mobile icon start */}

            <div className='w-8 md:w-12 h-8 md:h-12 rounded-full flex justify-center 
            items-center hover:bg-black/[0.05] cursor-pointer relative md:hidden'>
              {mobileMenu ? (
                <VscChromeClose className='text-[16px]'
                  onClick={() => setMobileMenu(false)}
                />
              ) : (
                <BiMenuAltRight className='text-[20px]'
                  onClick={() => setMobileMenu(true)}
                />
              )
              }
            </div>
          </div>
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
      </Wrapper>
    </header>
  );
};

export default Header;
