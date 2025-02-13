import agent from "../../app/agent"; // Đảm bảo đường dẫn đúng

export const productsApi = async (pageNumber, filterData) => {
  const params = new URLSearchParams();
  params.append("page", pageNumber.toString());
  params.append("limit", "4"); // Số sản phẩm mỗi trang
  try {
    return await agent.Product.getAllProducts(params);
  } catch (error) {
    throw error;
  }
};
