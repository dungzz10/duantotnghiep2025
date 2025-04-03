import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import React, { useState } from 'react'
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import { getBaseUrl } from '../../utils/baseURL';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [support, setsupport] = useState('');

  //dùng mutation 
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${getBaseUrl()}/api/v1/contact/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(() => {
        message.success('Gửi thông tin thành công')
      });
      if (!response.ok) {
        message.error("Gửi thông tin thất bại ")
      }
      return response.json()
    },
  })

  //xử lý form submit 
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      phone,
      support
    }
    mutation.mutate(data);
  }


  return (
    <section className='p-6 bg-gray-200'>
      <h1 className="text-3xl font-bold text-center mb-6">Liên Hệ Với Chúng Tôi</h1>
      <div className=' mx-auto bg-white rounded shadow p-6 flex justify-center items-center flex-col'>
        <div className="max-w-md mx-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className='block text-gray-600 mb-1'>Họ và tên :</label>
              <input
                className='w-[320px] border p-2 rounded'
                type="text" name="name"
                placeholder='Nhập tên của bạn'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
            </div>

            <div>
              <label className='block text-gray-600 mb-1'>Số điện thoại :</label>
              <input
                className='w-[320px] border p-2 rounded'
                type="text" name="phone"
                placeholder='Nhập số điện thoại của bạn'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required />
            </div>

            <div>
              <label className='block text-gray-600 mb-1'>Email :</label>
              <input
                className='w-[320px] border p-2 rounded'
                type="text" name="email"
                placeholder='Nhập địa chỉ email của bạn'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
            </div>

            <div>
              <label className='block text-gray-600 mb-1'>Nội dung liên hệ :</label>
              <textarea
                name="support"
                className='w-[320px] border p-2 rounded'
                value={support}
                onChange={(e) => setsupport(e.target.value)}
                rows={4}
                placeholder='Nội dung'></textarea>
            </div>

            <div>
              <button type='submit'
                className='w-full max-w-[800px] bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
                disabled={mutation.isLoading}
              >
                {mutation.isLoading ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>
          </form>
        </div>
        <footer className="mt-10 p-4 rounded-lg shadow-lg">
          <div className="mb-6">
            <p className="text-lg">Chúng tôi luôn sẵn sàng hỗ trợ bạn! Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với chúng tôi qua thông tin bên dưới:</p>
            <p className="mt-4"><strong>Email:</strong> support@giay.com</p>
            <p className='my-4'><strong>Điện thoại:</strong> 0123-456-789</p>
            <p><strong>Địa chỉ:</strong> 123 Đường Giày, Thành Phố, Việt Nam</p>
          </div>
          <div className="container mx-auto text-center">
            <p className="text-sm text-gray-600">© 2025 shoes nike. Bảo lưu mọi quyền.</p>
            <p className="text-sm text-gray-600">Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn.</p>
          </div>
        </footer>
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Theo Dõi Chúng Tôi</h2>
        <p className="text-lg">Đừng quên theo dõi chúng tôi trên mạng xã hội để nhận thông tin mới nhất!</p>
        <div className="flex justify-center space-x-4 mt-4">
          <div className="flex gap-4 justify-center md:justify-start">
            <div onClick={() => window.open('https://facebook.com')} className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaFacebookF size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaTwitter size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaYoutube size={20} />
            </div>
            <div className="w-10 h-10 rounded-full bg-white/[0.25] flex items-center justify-center text-black hover:bg-white/[0.5] cursor-pointer">
              <FaInstagram size={20} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ContactPage