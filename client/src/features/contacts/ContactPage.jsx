import React from 'react'

const ContactPage = () => {
  return (
    <section className='p-6 bg-gray-200'>
      <div className='max-w-lg mx-auto bg-white rounded shadow p-6'>
        <form >
          <h2 className='text-3xl font-bold text-gray-800 text-center'>Liên hệ với chúng tôi</h2>
          <div>
            <label className='block text-gray-600 mb-1'>Họ và tên :</label>
            <input className='w-full border p-2 rounded' type="text" name="name" placeholder='Nhập tên của bạn' required />
          </div>
          <div>
            <label className='block text-gray-600 mb-1'>Email :</label>
            <input className='w-full border p-2 rounded' type="text" name="name" placeholder='Nhập tên của bạn' required />
          </div>
          <div>
            <label className='block text-gray-600 mb-1'>Nội dung liên hệ :</label>
            <textarea name="message" className='w-full border p-2 rounded' rows={4} placeholder='Nội dung'></textarea>
            <button type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
            >
              Gửi  
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default ContactPage