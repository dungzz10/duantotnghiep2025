import React, { useEffect, useState } from "react";
import { api } from "../../axios/api";

const FavouritePage = () => {
  const [data, setData] = useState([]);
  console.log(data, 111111111111111);

  useEffect(() => {
    const fetchFavourites = async () => {
      const response = await api.get(`/favourite`);
      setData(response.data.data.favourites);
    };

    fetchFavourites();
  }, []);

  const removeFavourite = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?"
    );

    if (confirmDelete) {
      await api.delete(`/favourite/${productId}`);

      // Gọi lại hàm fetch để cập nhật danh sách
      const response = await api.get(`/favourite`);
      setData(response.data.data.favourites);
    }
  };

  return (
    <>
      <main>
        <section className="container max-w-screen-xl m-auto mt-16">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[40px]">Danh sách yêu thích</h2>
            <a
              href="./shop.html"
              className="border border-solid border-yellow-500 px-4 py-2 font-semibold text-base text-yellow-500 "
            >
              Xem tất cả sản phẩm
            </a>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {data && data.length > 0 ? (
              data.map((item) => (
                <div key={item._id}>
                  <div className="overflow-hidden">
                    <img
                      src={item.image[0]?.url}
                      alt={item.title}
                      className="hover:scale-125 duration-1000"
                    />
                  </div>
                  <div className="bg-[#F5F5F5] p-4">
                    <h3 className="font-semibold text-xl">{item.title}</h3>
                    <p className="text-[#898989] text-base mt-1 mb-2">
                      {item.description}
                    </p>
                    <p className="font-semibold text-xl text-red-600 mb-3">
                      {item.salePrice
                        ? item.salePrice.toLocaleString() + "đ"
                        : item.originalPrice.toLocaleString() + "đ"}
                    </p>

                    <br />
                    <button
                      onClick={() => removeFavourite(item._id)}
                      className="mt-4 border border-solid border-red-700 text-red-700 w-full font-semibold text-base py-2 hover:bg-yellow-700 hover:text-white"
                    >
                      Xóa khỏi danh sách yêu thích
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Danh sách yêu thích trống.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default FavouritePage;
