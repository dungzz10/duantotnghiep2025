import React from 'react'
import {BsChevronDown} from 'react-icons/bs'
import { Link } from "react-router-dom";

const Menu = ({showCatMenu,setShowCatMenu}) => {
    const data = [
        { id: 1, name: "Trang chủ", url: "/" },
        { id: 2, name: "Giới thiệu ", url: "/about" },
        { id: 3, name: "Danh mục ", subMenu: true },
        { id: 4, name: "Liên hệ", url: "/contact" },
    ];
    
    const subMenuData = [
        { id: 3.1, name: "Sản phẩm", url: "/products" },
      { id: 3.2, name: "Phụ kiện", url: "/accessory" },
      { id: 3.3, name: "Giảm giá", url: "/product/sale" },
      { id: 3.4, name: "Mới ra mắt", url: "/product/new" },
      { id: 3.5, name: "Thương hiệu", url: "/branch" },
    ];
  return (
    <ul className='hidden md:flex items-center gap-8 font-medium text-black'>
        {data.map((item) =>{
            return(
                <React.Fragment key={item.id}>
                    {!!item.subMenu ? 
                    <li className='cursor-pointer flex items-center gap-2 relative'
                        onMouseEnter={() => setShowCatMenu(true)}
                        onMouseLeave={() => setShowCatMenu(false)}
                    >
                        {item.name}
                        <BsChevronDown size={14}/>
                        {showCatMenu && (
                            <ul 
                            className='bg-white absolute top-6 left-0 min-w-[250px] 
                            px-1 py-1 text-black shadow-lg'>
                                {subMenuData.map((submenu) =>{
                                    return(
                                        <li className='h-12 flex justify-between items-center
                                         px-3 hover:bg-black/[0.05] rounded-md'>
                                             <Link to={submenu?.url} className="flex-1">{submenu.name}</Link>
                                            <span className='opacity-50 text-sm'>99</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </li>
                    :
                    (<li className='cursor-pointer'>
                        <Link to={item?.url}>{item.name}</Link>
                    </li>)
                    }
                </React.Fragment>
            )
        })}

    </ul>
  )
}

export default Menu
