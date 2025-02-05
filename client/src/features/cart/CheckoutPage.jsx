import React, { useState } from 'react'

const CheckoutPage = () => {
    const [formData, setFormData] = useState({ //state lưu thông tin người dùng nhập vào form
        name: '',
        email: '',
        phone: '',
        address: '',
        note: '',
        paymentMethod: 'COD', // mặc định là thanh toán khi nhận hàng
    })

    const [discountCode, setDiscountCode] = useState("") // state lưu mã giảm giá người dùng nhập vào
    const [discount, setDiscount] = useState(0) // state lưu phần trăm mã giảm giá hiện tại
    const [totalPrice, setTotalPrice] = useState(500000) // tổng gias mặc định 500k

    const validCodes = {
        GIAM10: 10, //giảm 10%,
        GIAM20: 20, //giảm 20%
    }

    //xử lý thay đổi dữ liệu trong form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value })
    }

    //áp dụng mã giảm giá 
    const handleDiscountApply = () =>{
        if(validCodes[discountCode]){
            const discountPercent = validCodes[discountCode]
            const discountedPrice = totalPrice - (totalPrice * discountPercent) /100;
            setDiscount(discountPercent)
            setTotalPrice(discountedPrice);
            alert(`áp dụng mã giảm giá thành công, giảm ${discountPercent}%`);
        }else{
            alert('mã giảm giá không hợp lệ');
            setDiscount(0);
            setDiscountCode("")
        }
    }

    //gửi form đặt hàng
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Đặt hàng thành công")
    }
    return (
        <div className='min-h-screen bg-gray-100 p-4 '>
            <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl font-bold mb-4'>Thông tin thanh toán</h1>
                <form
                onSubmit={handleSubmit}
                className='grid grid-cols-1 gap-3'>
                    <div>
                        <label htmlFor="name" className='block text-sm font-medium text-gray-700'
                        >Họ và tên:</label>
                        <input
                            type="text"
                            name='name'
                            id='name'
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder='nhập họ và tên'
                            className='mt-1 p-2 border border-gray-300 rounded-sm w-full '
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700'
                        >Email :</label>
                        <input
                            type="email"
                            name='email'
                            id='email'
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder='nhập email của bạn'
                            className=' mt-1 p-2 border border-gray-300 rounded-sm w-full '
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className='block text-sm font-medium text-gray-700'
                        >Số điện thoại :</label>
                        <input
                            type="phone"
                            name='phone'
                            id='phone'
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder='nhập số điện thoại của bạn'
                            className='mt-1 p-2 border border-gray-300 rounded-sm w-full '
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className='block text-sm font-medium text-gray-700'
                        >Địa chỉ :</label>
                        <input
                            type="text"
                            name='address'
                            id='address'
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder='nhập địa chỉ của bạn'
                            className='mt-1 p-2 border border-gray-300 rounded-sm w-full '
                            required
                        />
                    </div>
                    
                    <div >
                        <label htmlFor="address" className='block text-sm font-medium text-gray-700'
                        >Mã giảm giá :</label>
                        <div className='flex items-center gap-1'>
                            <input
                                type="text"
                                name=""
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                                id=""
                                placeholder='nhập mã giảm giá (nếu có)'
                                className='p-2 mt-1 border border-gray-300  rounded-md  w-full'
                            />
                            <button
                            type='button'
                            onClick={handleDiscountApply}
                                className='bg-blue-500 whitespace-nowrap py-2 text-white font-bold px-5 rounded-md hover:bg-blue-700'
                            >Áp dụng</button>
                        </div>
                    </div>


                    <div>
                        <label htmlFor="note" className='block text-sm font-medium text-gray-700'
                        >Lời nhắn :</label>
                        <textarea
                            name="note"
                            id="note"
                            placeholder='để lại lời nhắn'
                            className=' p-2 border border-gray-300 rounded-sm w-full ' rows={3}></textarea>
                    </div>

                    {/* Tóm tắt đơn hàng  */}

                    <div className='bg-gray-100 p-4 rounded-lg'>
                            <h2 className='text-lg font-semibold mb-2'>Tóm tắt đơn hàng:</h2>
                            <div className='flex justify-between'>
                                <span>Sản phẩm 1</span>
                                <span>200,000 vnd</span>
                            </div>

                            <div className='flex justify-between'>
                                <span>Sản phẩm 2</span>
                                <span>300,000 vnd</span>
                            </div>

                            <hr className='my-2'/>
                            <div className='flex justify-between font-bold'>
                                <span>Tổng cộng</span>
                                <span>{totalPrice.toLocaleString()}vnđ</span>
                            </div>
                    </div>

                    <button className='bg-blue-600 text-white font-bold px-4 py-2 rounded hover:bg-blue-700 '
                    >Đặt hàng</button>
                </form>
            </div>
        </div>
    )
}

export default CheckoutPage
