import React, { useEffect, useState } from "react";
import { api } from "../../axios/api";

const AccessoryPage = () => {
  const [accessories, setAccessories] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await api.get("/accessory/getall");
      console.log(response.data.data, 9999);

      setAccessories(response.data.data);
    }
    fetchData();
  }, []);

  return (
    <main>
      <section className="container max-w-screen-xl m-auto grid grid-cols-12 gap-8 mt-16">
        <div className="col-span-3">
          <h2 className="font-semibold text-xl mb-4">Mục lục</h2>
          <ul>
            <li className="font-medium text-[#737373] mb-2 hover:text-yellow-600">
              <a href>Tất</a>
            </li>
            <li className="font-medium text-[#737373] mb-2 hover:text-yellow-600">
              <a href>lot giay</a>
            </li>
            <li className="font-medium text-[#737373] mb-2 hover:text-yellow-600">
              <a href>Máy khử mùi </a>
            </li>
            <li className="font-medium text-[#737373] mb-2 hover:text-yellow-600">
              <a href>Lót giày</a>
            </li>
          </ul>
        </div>

        <div className=" col-span-9 ">
          <div className="grid grid-cols-3 gap-8">
            {accessories.map((item) => (
              <div key={item.id}>
                <div className="overflow-hidden">
                  {item.image.length > 0 && (
                    <img
                      src={item.image[0].url}
                      alt={item.title}
                      className="hover:scale-125 duration-1000"
                    />
                  )}
                </div>
                <div className="bg-[#F5F5F5] p-4">
                  <h3 className="font-semibold text-xl">{item.title}</h3>
                  <p className="text-[#898989] text-base mt-1 mb-2">
                    {item.description}
                  </p>
                  <p className="font-semibold text-xl text-red-600 mb-3">
                    {item.originalPrice}{" "}
                  </p>
                  <button className=" border border-solid border-yellow-700 text-yellow-700 w-full fomt-semibold text-base-16 py-2 hover:bg-yellow-700 hover:text-white">
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <a
              href
              className="py-2 px-4 bg-yellow-600 inline-block text-white font-bold rounded-md"
            >
              1
            </a>
            <a
              href
              className="py-2 px-4 bg-[#A3A3A3] inline-block text-white font-bold rounded-md"
            >
              2
            </a>
            <a
              href
              className="py-2 px-4 bg-[#A3A3A3] inline-block text-white font-bold rounded-md"
            >
              3
            </a>
            <a
              href
              className="py-2 px-4 bg-[#A3A3A3] inline-block text-white font-bold rounded-md"
            >
              Next
            </a>
          </div>
        </div>
      </section>
      <section className="bg-[#FFF7ED] py-16 mt-16">
        <div className=" container max-w-screen-xl m-auto grid grid-cols-4">
          <div className="flex gap-5">
            <img
              src="https://img.lovepik.com/free-png/20211211/lovepik-champion-trophy-png-image_401486915_wh1200.png"
              alt=""
              class="w-10  h-10 "
            />
            <div>
              <h3 className="font-semibold text-xl">Chất lượng cao </h3>
              <p className="text-[#898989]">
                Được chế tạo từ vật liệu hàng đầu{" "}
              </p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/support.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Hỗ trợ 24/7 </h3>
              <p className="text-[#898989]">Hỗ trợ chuyên dùng </p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/protection.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Bảo vệ bảo hành </h3>
              <p className="text-[#898989]"> 12 tháng </p>
            </div>
          </div>
          <div className="flex gap-5">
            <img src="./assets/images/shipping.png" alt />
            <div>
              <h3 className="font-semibold text-xl">Miễn phí vận chuyển </h3>
              <p className="text-[#898989]">Đơn hàng trên 300k </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AccessoryPage;
