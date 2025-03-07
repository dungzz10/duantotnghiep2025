import agent from "../../app/agent"; // Đảm bảo đường dẫn đúng

export const productsApi = async (pageNumber, filterData) => {
  const params = new URLSearchParams();
  params.append("page", pageNumber.toString());
  params.append("limit", filterData.limit); // Số sản phẩm mỗi trang
  if (filterData?.query) params.append("title", filterData.query);
  if (filterData?.category) params.append("category", filterData.category);
  if (filterData?.brand) params.append("brand", filterData.brand);
  if (filterData?.price) {
    const { originalPrice, operator } = filterData.price;
    // console.log("price", originalPrice, operator);
    switch (operator) {
      case "lt":
        params.append("originalPrice[lt]", originalPrice);
        break;
      case "gt":
        params.append("originalPrice[gt]", originalPrice);
        break;
     default:
        params.append("originalPrice", originalPrice);
        break;
    }
  }

  // console.log("param",params)
  try {
    return await agent.Product.getAllProducts(params);
  } catch (error) {
    throw error;
  }
};
