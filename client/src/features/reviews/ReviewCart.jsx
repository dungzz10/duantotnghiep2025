import React, { useState } from 'react'
import PostAReview from './PostAReview'
import RatingStarts from '../../components/RatingStarts'
import { formatDate } from '../../utils/fomatDate'
import { useContext } from 'react';

const ReviewCart = ({ productReviews }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)//trạng thái đóng mở
    const reviews = productReviews || [] // mảng ds bình luậnluận

    //nút mở model khi thêm bình luận 
    const handleOpenReviewModal = () => {
        setIsModalOpen(true)
    }

    const handleCloseReviewModal = () => {
        setIsModalOpen(false)
    }
    return (
        <div className='my-6 bg-white p-8'>
            <div>
                {
                    reviews.length > 0 ?
                        (<div>
                            <h3 className="text-lg font-medium">Tất cả đánh giá:</h3>
                            <div>
                                {
                                    reviews.map((review, index) => (
                                        <div key={index} className='mt-4'>
                                            <div className='flex gap-4 items-center'>
                                                <img className='size-14' alt="" src='/src/assets/avatar.png'/>
                                                <div className='space-y-1'>
                                                    <p
                                                        className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'
                                                    >{review?.userId.userName}</p>
                                                    <p
                                                        className='text-[12px] italic'
                                                    >{formatDate(review?.updatedAt)}</p>
                                                    <RatingStarts rating={review?.rating} />
                                                </div>
                                            </div>
                                            <div className='text-gray-600 mt-5 border p-8'>
                                                <p>{review?.comment}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>)
                        : <p>Sản phẩm chưa có đánh giá</p>
                }
            </div>

            {/* Nút thêm bình luận */}
            <div >
                <button
                    onClick={handleOpenReviewModal}
                    className="px-6 py-3 bg-blue-900 text-white rounded-md mt-9">
                    Thêm đánh giá </button>
            </div>

            {/* Nút tắt model khi bấm thêm review và add review */}
            <PostAReview
                isModalOpen={isModalOpen}
                handleClose={handleCloseReviewModal}
            />
        </div>
    )
}

export default ReviewCart
