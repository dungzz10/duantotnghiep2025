// import React, { useEffect, useState } from "react";
// import { api } from "../../axios/api";
import React from "react";
const FavouritePage = () => {
  
  //   const [accessories, setAccessories] = useState([]);

  //   useEffect(() => {
  //     async function fetchData() {
  //       const response = await api.get("/accessory/getall");
  //       console.log(response.data.data, 9999);

  //       setAccessories(response.data.data);
  //     }
  //     fetchData();
  //   }, []);

  return (
    <>
    <main>
      <section className="container max-w-screen-xl m-auto mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="fomt-semibold text-[40px]">New Products</h2>
          <a
            href="./shop.html"
            className="border border-solid border-yellow-500 px-4 py-2 font-semibold text-base text-yellow-500 "
          >
            View all products
          </a>
        </div>
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="overflow-hidden">
              <img
                src="./assets/images/product1.jpg"
                alt
                className="hover:scale-125 duration-1000 "
              />
            </div>
            <div className="bg-[#F5F5F5] p-4">
              <h3 className="font-semibold text-xl">Syltherine</h3>
              <p className="text-[#898989] text-base mt-1 mb-2">
                Stylish cafe chair
              </p>
              <p className="font-semibold text-xl text-red-600 mb-3">
                2.500.000đ
              </p>
              <button className=" border border-solid border-yellow-700 text-yellow-700 w-full fomt-semibold text-base-16 py-2 hover:bg-yellow-700 hover:text-white">
                Add to cart
              </button>
            </div>
          </div>
          <div>
            <div className="overflow-hidden">
              <img
                src="./assets/images/product2.jpg"
                alt
                className="hover:scale-125 duration-1000 "
              />
            </div>
            <div className="bg-[#F5F5F5] p-4">
              <h3 className="font-semibold text-xl">Leviosa</h3>
              <p className="text-[#898989] text-base mt-1 mb-2">
                Stylish cafe chair
              </p>
              <p className="font-semibold text-xl text-red-600 mb-3">
                1.800.000đ
              </p>
              <button className=" border border-solid border-yellow-700 text-yellow-700 w-full fomt-semibold text-base-16 py-2 hover:bg-yellow-700 hover:text-white">
                Add to cart
              </button>
            </div>
          </div>
          <div>
            <div className="overflow-hidden">
              <img
                src="./assets/images/product3.jpg"
                alt
                className="hover:scale-125 duration-1000 "
              />
            </div>
            <div className="bg-[#F5F5F5] p-4">
              <h3 className="font-semibold text-xl">Lolito</h3>
              <p className="text-[#898989] text-base mt-1 mb-2">
                Luxury big sofa
              </p>
              <p className="font-semibold text-xl text-red-600 mb-3">
                2.000.000đ
              </p>
              <button className=" border border-solid border-yellow-700 text-yellow-700 w-full fomt-semibold text-base-16 py-2 hover:bg-yellow-700 hover:text-white">
                Add to cart
              </button>
            </div>
          </div>
          <div>
            <div className="overflow-hidden">
              <img
                src="./assets/images/product4.jpg"
                alt
                className="hover:scale-125 duration-1000 "
              />
            </div>
            <div className="bg-[#F5F5F5] p-4">
              <h3 className="font-semibold text-xl">Respira</h3>
              <p className="text-[#898989] text-base mt-1 mb-2">
                Outdoor bar table and stool
              </p>
              <p className="font-semibold text-xl text-red-600 mb-3">
                4.500.000đ
              </p>
              <button className=" border border-solid border-yellow-700 text-yellow-700 w-full fomt-semibold text-base-16 py-2 hover:bg-yellow-700 hover:text-white">
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-[#FFF7ED] py-16 mt-16">
        <div className=" container max-w-screen-xl m-auto grid grid-cols-4">
          <div className="flex gap-5">
            <img src="./assets/images/quality.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Chất lượng cao </h3>
              <p className="text-[#898989]">
                Được chế tác từ những vật liệu hàng đầu
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/support.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Hỗ trợ 24/7 </h3>
              <p className="text-[#898989]">Hỗ trợ tận tình</p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/protection.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Bảo hành </h3>
              <p className="text-[#898989]">6 tháng </p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/shipping.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Miễn phí ship </h3>
              <p className="text-[#898989]">Các đơn từ 300k</p>
            </div>
          </div>
        </div>
      </section>
    </main>
    </>
  );
};

export default FavouritePage;
