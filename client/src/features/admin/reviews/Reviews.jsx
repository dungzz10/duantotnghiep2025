import React, { useState, useEffect } from 'react';
import axios from "axios";
import RatingStarts from '../../../components/RatingStarts';
import AdminBreadcrumb from '../../../components/admin/AdminBreadcrumb';

const Reviews = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState({
    search: '',
    status: 'all',
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/v1/reviews`);
      setComments(res.data);
    } catch (error) {
      console.error("Lỗi khi lấy bình luận:", error);
    }
  };

  const toggleVisibility = async (id, hidden) => {
    try {
      await axios.put(`http://localhost:5000/api/v1/reviews/${id}`, {
        hidden: !hidden,
      });
      fetchComments();
    } catch (error) {
      console.error("Lỗi khi ẩn/hiện bình luận:", error);
    }
  };

  const filteredComments = comments.filter(cmt => {
    const keyword = filter.search.toLowerCase();
    const matchesKeyword =
      cmt.userId?.name?.toLowerCase().includes(keyword) ||
      cmt.productId?.title?.toLowerCase().includes(keyword) ||
      cmt.comment?.toLowerCase().includes(keyword);

    const matchesStatus =
      filter.status === 'all' ||
      (filter.status === 'visible' && !cmt.hidden) ||
      (filter.status === 'hidden' && cmt.hidden);

    return matchesKeyword && matchesStatus;
  });

  return (
    <div style={{ padding: "20px" }}>
      <AdminBreadcrumb />
      <h2 className="text-2xl font-bold mb-6">Quản lý đánh giá sản phẩm</h2>
      {/* Bộ lọc */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Tìm theo người dùng, sản phẩm, nội dung..."
          className="border px-3 py-2 rounded-md w-full sm:w-1/2"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <select
          className="border px-3 py-2 rounded-md"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="all">Tất cả</option>
          <option value="visible">Đang hiển thị</option>
          <option value="hidden">Đã ẩn</option>
        </select>
      </div>

      {/* Bảng hiển thị */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left">Người dùng</th>
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-left">Nội dung</th>
              <th className="px-4 py-3 text-left">Đánh giá</th>
              <th className="px-4 py-3 text-left">Thời gian</th>
              <th className="px-4 py-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {filteredComments.map((cmt) => (
              <tr
                key={cmt._id}
                className={`border-b hover:bg-gray-50 transition ${
                  cmt.hidden ? 'opacity-50 bg-red-50' : ''
                }`}
              >
                <td className="px-4 py-3">{cmt.userId?.name || 'Ẩn danh'}</td>
                <td className="px-4 py-3">{cmt.productId?.title || '---'}</td>
                <td className="px-4 py-3">{cmt.comment}</td>
                <td className="px-4 py-3">
                  <RatingStarts rating={cmt.rating} />
                </td>
                <td className="px-4 py-3">{new Date(cmt.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleVisibility(cmt._id, cmt.hidden)}
                    className={`px-3 py-1 rounded-md text-white text-xs font-semibold ${
                      cmt.hidden
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {cmt.hidden ? 'Hiện lại' : 'Ẩn'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredComments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có đánh giá nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
