import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axios.put(
        `http://localhost:5000/api/v1/product/${id}`,
        data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  return { mutate, isLoading };
};

export default useUpdateProduct;
