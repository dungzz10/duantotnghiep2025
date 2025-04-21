import React from "react";
import { deleteBanner, fetchBanners } from "./apiListBanner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AdminBreadcrumb from "../../../../components/admin/AdminBreadcrumb";

const ListBanner = () => {
    const queryClient = useQueryClient();

    // Fetch danh sách banner
    const { data, isLoading, error } = useQuery({
        queryKey: ["banners"],
        queryFn: fetchBanners,
    });

    // Xóa banner
    const mutation = useMutation({
        mutationFn: deleteBanner,
        onSuccess: (_, id) => {
            queryClient.setQueryData(["banners"], (oldData) => {
                if (!oldData) return { banners: [] };
                const updatedBanners = oldData.banners.filter((banner) => banner._id !== id);
                return { banners: updatedBanners };
            });

            // Nếu danh sách trống, fetch lại dữ liệu
            if (queryClient.getQueryData(["banners"])?.banners.length === 0) {
                queryClient.invalidateQueries(["banners"]);
            }
        },
    });

    const banners = data?.banners ?? [];

    return (
        <div style={{ padding: "20px" }}>
            <AdminBreadcrumb />
            <div className="flex flex-col sm:flex-row justify-between items-center mb-5 gap-3">
                <h1 className="text-2xl font-bold text-gray-800">Danh sách Banner</h1>

                <Link
                    to="/admin/add-banner"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                >
                    ➕ Thêm Banner
                </Link>
            </div>

            <div className="overflow-x-auto w-full bg-white shadow-lg rounded-lg">
                <table className="w-full min-w-[100px] border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tiêu đề</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold hidden sm:table-cell">Hình ảnh</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Trạng thái</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.length > 0 ? (
                            banners.map((banner, index) => (
                                <tr key={index} className="border-t hover:bg-gray-50 transition">
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">{index + 1}</td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap">{banner.title}</td>
                                    <td className="px-4 py-3 flex justify-center hidden sm:table-cell">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-16 h-16 object-cover rounded-md shadow-md"
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm">
                                        <span
                                            className={`px-3 py-1 rounded-full text-white text-xs ${banner.isActive ? "bg-green-500" : "bg-red-500"
                                                }`}
                                        >
                                            {banner.isActive ? "Hiện" : "Ẩn"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex flex-wrap justify-center gap-2">
                                        <Link
                                            to={`/admin/edit-banner/${banner._id}`}
                                            className="bg-green-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-green-600 transition"
                                        >
                                            ✏️ Sửa
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
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600 transition"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-5 text-center text-gray-600">
                                    🚀 Không có banner, vui lòng thêm!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListBanner;
