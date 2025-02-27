import React from 'react';
import { deleteBanner, fetchBanners } from './apiListBanner';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ListBanner = () => {
    const queryClient = useQueryClient();

    // Fetch danh sách banner
    const { data, isLoading, error } = useQuery({
        queryKey: ['banners'],
        queryFn: fetchBanners
    });

    // Hàm xóa banner
    const mutation = useMutation({
        mutationFn: deleteBanner,
        onSuccess: (_, id) => {
            queryClient.setQueryData(["banners"], (oldData) => {
                if (!oldData) return { banners: [] };
                const updatedBanners = oldData.banners.filter(banner => banner._id !== id);
                return { banners: updatedBanners };
            });
    
            // Nếu danh sách trống, fetch lại dữ liệu
            if (queryClient.getQueryData(["banners"])?.banners.length === 0) {
                queryClient.invalidateQueries(["banners"]);
            }
        }
    });
    
    

    // Kiểm tra nếu banners không tồn tại hoặc rỗng
    const banners = data?.banners ?? [];

    return (
        <div className="container mx-auto p-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-semibold text-gray-800">Danh sách Banner</h1>
                <Link to="/admin/add-banner" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                    Thêm Banner
                </Link>
            </div>

            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tiêu đề</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hình ảnh</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Trạng thái</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.length > 0 ? (
                        banners.map((banner) => (
                            <tr key={banner._id} className="border-t">
                                <td className="px-4 py-2 text-sm text-gray-800">{banner._id}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">{banner.title}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                    <img src={banner.image} alt={banner.title} className="w-16 h-16 object-cover rounded-md" />
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-800">{banner.isActive ? 'Hiện' : 'Ẩn'}</td>
                                <td className="px-4 py-2 text-sm text-gray-800">
                                <Link
                                        to={`/admin/edit-banner/${banner._id}`}
                                        className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                                    >
                                        Sửa
                                    </Link>
                                    <button
                                        onClick={() => {
                                            Swal.fire({
                                                title: "Bạn có chắc chắn muốn xóa banner này?",
                                                text: "Hành động này không thể hoàn tác!",
                                                icon: "warning",
                                                showCancelButton: true,
                                                confirmButtonColor: "#d33",
                                                cancelButtonColor: "#3085d6",
                                                confirmButtonText: "Xóa ngay",
                                                cancelButtonText: "Hủy",
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    mutation.mutate(banner._id);
                                                    Swal.fire("Đã xóa!", "Banner đã được xóa thành công.", "success");
                                                }
                                            });
                                        }}
                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="px-4 py-4 text-center text-gray-600">
                                Không có banner, vui lòng thêm
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListBanner;
