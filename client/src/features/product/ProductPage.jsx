import React from 'react'
import { Link } from 'react-router-dom'
import { Input, Select, Button } from 'antd';
const { Option } = Select;
import { Carousel } from "react-responsive-carousel";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from '../admin/banners/listBannerAdmin/apiListBanner';
const ProductPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
  });
  return (
    <>
      <div className="bg-gray-100 min-h-screen">
        {/* Header Quảng Cáo */}
        <header className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Khuyến Mãi Đặc Biệt!</h1>
          <p className="text-lg">Nhận ngay ưu đãi lên đến 50% cho tất cả sản phẩm!</p>
        </header>

        {/* Tìm kiếm và Lọc sản phẩm */}
        <div className="container mx-auto p-6 flex items-center justify-between">
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            enterButton="Tìm kiếm"
            className="w-1/2"
          />
          <Select defaultValue="" className="ml-4 w-1/4" placeholder="Lọc sản phẩm">
            <Option value="1">Danh mục 1</Option>
            <Option value="2">Danh mục 2</Option>
          </Select>
        </div>

        {/* Hình ảnh sản phẩm */}
        <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Carousel className='col-span-2'
        autoPlay
        infiniteLoop
        showThumbs={false}
        showIndicators={true}
        showStatus={false}
        transitionTime={800}
      >
        {data?.banners?.map((banner) => (
          <div key={banner._id} className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] max-h-[500px]">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-lg"
              src={banner.image}
              alt={banner.title}
            />
          </div>
        ))}
      </Carousel>
          <div className="flex flex-col space-y-4 my-auto">
            <img src="data:image/jpeg;base64,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" alt="Sản phẩm nhỏ 1" className="w-full rounded-lg shadow-md" />
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT86kIqUmZfPv5C2_5pyMEzwQbN2WCraeGhXQ&s" alt="Sản phẩm nhỏ 2" className="w-full rounded-lg shadow-md" />
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-[36px] my-8">Tất cả sản phẩm</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            {/* More products... */}
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-center text-[36px] mb-8">Sản phẩm đang giảm giá</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            <Link to="#" className="group">
              <img
                src="https://contents.mediadecathlon.com/p1811470/k$8f44931538763b2e1b49cc4d21f491fa/gi%C3%A0y-ch%E1%BA%A1y-b%E1%BB%99-nam-run-active-grip-xanh-d%C6%B0%C6%A1ng-kalenji-8559113.jpg?f=768x0&format=auto"
                alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
              />
              <h3 className="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
              <p className="mt-1 text-lg font-medium text-gray-900">$48</p>
            </Link>
            {/* More products... */}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductPage