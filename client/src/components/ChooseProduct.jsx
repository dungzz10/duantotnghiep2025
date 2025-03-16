import React from 'react';
import { useNavigate } from 'react-router-dom';
import p1 from "../assets/p1.png"; 
import slide1 from "../assets/slide1.png"; 
import slide2 from "../assets/slide2.png"; 
const ShoeProductSelection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'running',
      title: 'RUNNING',
      subtitle: 'SHOES',
      backgroundColor: '#e0e5e5',
      textColor: '#333333',
      imageUrl: p1 // Hình ảnh giày Running
    },
    {
      id: 'casual',
      title: 'CASUAL',
      subtitle: 'SHOES',
      backgroundColor: '#e6d7d2',
      textColor: '#333333',
      imageUrl: slide1// Hình ảnh giày Casual
    },
    {
      id: 'formal',
      title: 'FORMAL',
      subtitle: 'SHOES',
      backgroundColor: '#1e1e1e',
      textColor: '#333333',
      imageUrl: slide2 // Hình ảnh giày Formal
    }
  ];

  return (
    <div className="w-full  mx-auto  bg-white mt-40">
      <h1 className="text-3xl font-bold text-center mb-8 pb-2 border-b-2 border-gray-200">
        Chọn Phong Cách Của Bạn 
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative cursor-pointer rounded-lg shadow-lg overflow-hidden"
            style={{
              backgroundColor: category.backgroundColor,
              height: '500px' // Làm cho card cao hơn để có không gian cho ảnh
            }}
            onClick={() => navigate('/products')}
          >
            {/* Text container */}
            <div className="absolute top-0 left-0 right-0 pt-8 pb-4 z-10 text-center">
              <h2 className="text-5xl font-bold leading-tight" style={{ color: category.textColor }}>
                {category.title}
              </h2>
              <p className="text-3xl font-light italic mt-2" style={{ color: category.textColor }}>
                {category.subtitle}
              </p>
            </div>

            {/* Image container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={category.imageUrl}
                alt={`${category.title} shoes`}
                className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-105"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'cover' // Đảm bảo ảnh chiếm toàn bộ không gian ô
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShoeProductSelection;
