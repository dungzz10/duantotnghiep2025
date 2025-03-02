import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkDeliveredOrder, postReview } from "./useReview";
import { Filter } from "bad-words";

const PostAReview = ({ isModalOpen, handleClose }) => {
  const { id } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();
  //tạo bộ lọc từ cấm 
  const filter = new Filter();
  filter.addWords("ngu", "dốt", "khùng","điên", "bực","ghét");
  // Hàm kiểm tra link trong bình luận
  const containsLink = (text) => {
    const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi; // Regex phát hiện link
    return urlRegex.test(text);
  };

  const mutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      queryClient.invalidateQueries("productReviews");
      alert("review thành công ");
      setComment("");
      setRating(0);
      handleClose();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để gửi đánh giá.");
      return;
    }
    const hasDeliveredOrder = await checkDeliveredOrder(user._id, id);
    if (!hasDeliveredOrder) {
      alert("Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua và đơn hàng đã được giao.");
      return;
    }

    if (filter.isProfane(comment)) {
      alert(`Bình luận của bạn có từ ngữ: (${comment}) bị cấm  `);
      return;
    }

    // Kiểm tra link trong bình luận
    if (containsLink(comment)) {
      alert("Bình luận của bạn không được chứa link.");
      return;
    }

    const newComment = {
      comment: comment,
      rating: rating,
      userId: user._id, // Lấy user từ localStorage
      productId: id,
    };
    mutation.mutate(newComment);
  };

  const handleRating = (value) => {
    setRating(value);
  };
  return (
    <div
      className={`fixed inset-0 bg-black/90 flex items-center
        justify-center z-40 px-2 ${isModalOpen ? "block" : "hidden"}
        `}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }} // Chỉ đóng modal nếu click vào vùng nền đen
    >
      <div
        className="bg-white p-6 rounded-md
             shadow-lg w-96 z-50"
      >
        <h2 className="text-lg font-medium mb-4">Thêm bình luận :</h2>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => handleRating(star)}
              className="cursor-pointer text-yellow-500 text-lg"
            >
              {rating >= star ? (
                <i className="ri-star-fill"></i>
              ) : (
                <i className="ri-star-line"></i>
              )}
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          row="4"
          className="w-full border border-gray-300 p-2
                rounded-md  mb-4 focus:outline-none"
        ></textarea>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded-md"
            onClick={handleClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={handleSubmit}
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostAReview;
