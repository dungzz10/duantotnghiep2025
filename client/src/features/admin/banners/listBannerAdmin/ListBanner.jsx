import React from 'react'
import { fetchBanners } from './apiListBanner'
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const ListBanner = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: fetchBanners
    })
    console.log(data);

    if (isLoading) return <p className="text-center text-lg text-gray-600">Đang tải dữ liệu...</p>
    if (error) return <p className="text-center text-lg text-red-500">Lỗi tải dữ liệu</p>
    
    return (
        <div className="container mx-auto p-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-semibold text-gray-800">Danh sách Banner</h1>
                <Link to="/add-banner" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Thêm Banner</Link>
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md table table-striped">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tiêu đề</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hình ảnh</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.banners.map((banner) => {
                        return (
                            <tr key={banner._id} className="border-t">
                                <td className="px-4 py-2 text-sm text-gray-800">{banner._id}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{banner.title}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                    <img src={banner.image} alt={banner.title} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">{banner.isActive ? 'Hiện' : 'Ẩn'}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default ListBanner
