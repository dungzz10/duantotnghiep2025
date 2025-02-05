import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react'

const ContactPage = () => {
  const [name,setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  //dùng mutation 
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('http://localhost:5000/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
     if(!response.ok){
      throw new Error("Gửi thất bại ")
     }
     return response.json()
    },
    onSuccess: (data) => {
      setResponseMessage('Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi bạn trong thời gian nhất.');
    },
    onError: (error) => {
      setResponseMessage('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    },
  })

  //xử lý form submit 
  const handleSubmit = (e) =>{
    e.preventDefault();
    const data = {
        name,
        email,
        message,
    }
    mutation.mutate(data);
  }


  return (
    <section className='p-6 bg-gray-200'>
      <div className='max-w-lg mx-auto bg-white rounded shadow p-6'>
        <form onSubmit={handleSubmit}>
          <h2 className='text-3xl font-bold text-gray-800 text-center'>Liên hệ với chúng tôi</h2>
          <div>
            <label className='block text-gray-600 mb-1'>Họ và tên :</label>
            <input
             className='w-full border p-2 rounded' 
             type="text" name="name" 
             placeholder='Nhập tên của bạn'
             value={name}
             onChange={(e) => setName(e.target.value)}
              required />
          </div>
          <div>
            <label className='block text-gray-600 mb-1'>Email :</label>
            <input
            className='w-full border p-2 rounded' 
            type="text" name="email"
             placeholder='Nhập tên của bạn'
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required />
          </div>
          <div>
            <label className='block text-gray-600 mb-1'>Nội dung liên hệ :</label>
            <textarea name="message"
             className='w-full border p-2 rounded' 
             value={message}
             onChange={(e) => setMessage(e.target.value)}
             rows={4} placeholder='Nội dung
             '></textarea>
            <button type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
            disabled={mutation.isLoading}
            >
                {mutation.isLoading ? 'Đang gửi...' : 'Gửi'}  
            </button>
          </div>
        </form>
        {responseMessage && <p className='text-red-500 text-center'>{responseMessage}</p>}
      </div>
    </section>
  )
}

export default ContactPage