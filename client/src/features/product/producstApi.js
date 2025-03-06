import agent from "../../app/agent"; // Đảm bảo đường dẫn đúng

export const productsApi = async (pageNumber, filterData) => {
  const params = new URLSearchParams();
  params.append("page", pageNumber.toString());
  params.append("limit", filterData.limit); // Số sản phẩm mỗi trang
  if(filterData?.query) params.append("title",filterData.query)
  try {
    return await agent.Product.getAllProducts(params);
  } catch (error) {
    throw error;
  }
};
