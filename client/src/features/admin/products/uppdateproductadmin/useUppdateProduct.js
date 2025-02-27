import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import agent from "../../../../app/agent";

const useUppdateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (productData) => {
      if (!productData.id) {
        throw new Error('Product ID is required');
      }
      const { id, ...updateData } = productData;
      return await agent.Product.uppdateProduct(id, updateData);
    },
    onSuccess: () => {
      message.success("Cập nhật sản phẩm thành công");
      queryClient.invalidateQueries(['products']);
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Update error:', error);
      message.error(error.response?.data?.message || "Lỗi khi cập nhật sản phẩm");
    }
  });
};

export default useUppdateProduct;