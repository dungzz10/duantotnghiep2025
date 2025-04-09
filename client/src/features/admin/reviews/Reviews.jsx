import React, { useState, useEffect } from 'react';
import axios from "axios";
import RatingStarts from '../../../components/RatingStarts';

const Reviews = () => {
  const [comments, setComments] = useState([]);

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

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Quản lý đánh giá sản phẩm</h2>
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
            {comments.map((cmt) => (
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
                      cmt.hidden ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {cmt.hidden ? 'Hiện lại' : 'Ẩn'}
                  </button>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Không có bình luận nào.
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
