import { useInfiniteQuery } from "@tanstack/react-query";
import { productsApi } from "./producstApi"; // Đảm bảo đường dẫn đúng

export const useAllProducts = (filterData) => {
  console.log("filterData", filterData);
  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery({
      queryKey: ["get-all-products", filterData],
      queryFn: ({ pageParam = 1 }) => productsApi(pageParam, filterData),
      getNextPageParam: (lastPage, allPages) => {
        //  console.log("lastPage", lastPage);
        // console.log("allPages", allPages);
        // lastPage: Dữ liệu trả về của trang cuối cùng (trang hiện tại).
        // allPages: Mảng chứa tất cả các trang đã tải cho đến nay.
        const { totalPages } = lastPage;
           // Hàm này giúp xác định trang tiếp theo cần gọi
        return allPages.length < totalPages ? allPages.length + 1 : undefined;
      },
    });

  return { data, fetchNextPage, hasNextPage, isLoading, isError };
};
