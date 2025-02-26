import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchBanners } from "../features/admin/banners/listBannerAdmin/apiListBanner";

const Banner = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchBanners
  })
  
  console.log(data);

  if (isLoading) return <p className="text-center text-lg text-gray-600">Đang tải dữ liệu...</p>
  if (error) return <p className="text-center text-lg text-red-500">Lỗi tải dữ liệu</p>
  return (
    <div className="relative text-[20px] w-full max-w-[1360px] mx-auto text-white">
      <Carousel
        autoPlay={true}
        infiniteLoop={true}
        showThumbs={false}
        showIndicators={false}
        showStatus={false}
      >
        {data?.banners?.map((banner, index) => (
          <div key={index}>
            <img
            className='w-full h-auto max-h-[500px] object-cover'
            src={banner.image} alt={`Banner ${index + 1}`} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
