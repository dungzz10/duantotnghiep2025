import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "../features/admin/banners/listBannerAdmin/apiListBanner";

const Banner = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });

  if (isLoading)
    return (
      <p className="text-center text-lg text-gray-600">Đang tải dữ liệu...</p>
    );

  if (error) {
    return (
      <div className="text-center text-lg text-red-500">
        <p>Lỗi tải dữ liệu. Đang hiển thị banner mặc định.</p>
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          transitionTime={800}
        >
          <div className="relative">
            <img
              className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              src="./src/assets/slide-1.png"
            />
          </div>
          <div className="relative">
            <img
              className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              src="./src/assets/slide-2.png"
            />
          </div>
          <div className="relative">
            <img
              className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              src="./src/assets/slide-3.png"
            />
          </div>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="relative text-[20px] w-full h-fit mx-auto text-white">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        transitionTime={800}
      >
        {data?.banners?.map((banner) => (
          <div
            key={banner._id}
            className="relative w-full max-w-full"
            style={{ aspectRatio: "16 / 9" }} // Tỷ lệ 16:9 cho hình ảnh
          >
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
              src={banner.image}
              alt={banner.title}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
