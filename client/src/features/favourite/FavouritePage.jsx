import React, { useEffect, useState } from "react";
import { api } from "../../axios/api";
import { Link } from "react-router-dom";
import { useUser } from "../../app/hook/LoadUser";

const FavouritePage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading, refetch } = useUser();
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await api.get("/favourite");
        setData(response.data.data.favourites);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  const removeFavourite = async (productId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi danh sách yêu thích?"
    );

    if (confirmDelete) {
      try {
        await api.delete(`/favourite/${productId}`);
        // Xóa sản phẩm khỏi danh sách hiện tại mà không cần phải gọi lại API
        setData((prevData) =>
          prevData.filter((item) => item._id !== productId)
        );
        refetch();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi danh sách yêu thích:", error);
      }
    }
  };

  if (loading) {
    return <p>Đang tải danh sách yêu thích...</p>;
  }

  return (
    <main>
      <section className="container max-w-screen-xl mx-auto mt-16 px-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-[36px] text-gray-900">
            Danh sách yêu thích
          </h2>
          <a
            href="/"
            className="border border-solid border-yellow-500 px-6 py-2 font-semibold text-base text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-white transition-all"
          >
            Xem tất cả sản phẩm
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.length > 0 ? (
            data.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl mb-8"
              >
                <Link to={`/products/${item._id}`} className="block w-full">
                  <div className="relative w-full">
                    <img
                      src={item.image[0]?.url}
                      alt={item.title}
                      className="w-full h-56 object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <div className="p-4 bg-[#F5F5F5]">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
                      {item.title}
                    </h3>
                    <p className="text-[#898989] text-sm mt-1 mb-2 truncate">
                      {item.description}
                    </p>
                    <p className="font-semibold text-xl text-red-600 mb-3">
                      {item.salePrice
                        ? item.salePrice.toLocaleString() + "đ"
                        : item.originalPrice.toLocaleString() + "đ"}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={() => removeFavourite(item._id)}
                  className="mt-4 border border-solid border-red-700 text-red-700 w-full font-semibold text-base py-2 rounded-md hover:bg-red-700 hover:text-white transition-all"
                >
                  Xóa khỏi danh sách yêu thích
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-xl text-gray-600">
              Danh sách yêu thích trống.
            </p>
          )}
        </div>
      </section>
    </main>
  );
};

export default FavouritePage;
