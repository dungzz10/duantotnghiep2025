import React from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { Link } from "react-router-dom";
import useFetchData from '../app/api/useFetchdata';

const Menu = ({ showCatMenu, setShowCatMenu }) => {
    const { data: categories } = useFetchData('categories');

    const menu = [
        { id: 1, name: "Trang chủ", url: "/" },
        { id: 1, name: "Sản phẩm", url: "/products" },
        { id: 4, name: "Thương hiệu", url: "/branch" },
        { id: 2, name: "Giới thiệu", url: "/gioi-thieu" },
        { id: 3, name: "Danh mục", subMenu: true },
        { id: 4, name: "Liên hệ", url: "/lien-he" },
    ];

    return (
        <ul className='hidden md:flex items-center gap-8 font-medium text-black'>
            {menu.map((item) => (
                <React.Fragment key={item.id}>
                    {item.subMenu ? (
                        <li className='cursor-pointer flex items-center gap-2 relative'
                            onMouseEnter={() => setShowCatMenu(true)}
                            onMouseLeave={() => setShowCatMenu(false)}
                        >
                            {item.name}
                            <BsChevronDown size={14} />
                            {showCatMenu && (
                                <ul className='bg-white absolute top-6 left-0 min-w-[250px] px-1 py-1 text-black shadow-lg'>
                                    {categories && categories.length > 0 ? (
                                        categories.map((category) => (
                                            <li key={category.id} className='h-12 flex justify-between items-center px-3 hover:bg-black/[0.05] rounded-md'>
                                                <Link to={`/danh-muc/${category._id}`} className="flex-1">{category.name}</Link>
                                                <span className='opacity-50 text-sm'>{category.products.length}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className='h-12 flex justify-center items-center px-3'>Loading...</li>
                                    )}
                                </ul>
                            )}
                        </li>
                    ) : (
                        <li className='cursor-pointer'>
                            <Link to={item.url}>{item.name}</Link>
                        </li>
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
}

export default Menu;