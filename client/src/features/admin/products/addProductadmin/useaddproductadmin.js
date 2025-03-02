import { message } from "antd";
import addproductAdminApi from "./addproductadminapi";
import { useMutation } from "@tanstack/react-query";
const useaddproductadmin = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      return await addproductAdminApi(data);
    },
    onSuccess: (data) => {
      console.log(data);
      // message.success("Thêm sản phẩm thành công");
    },
    onError: (error) => {
      console.log(error);
      // message.error("Thêm sản phẩm thất bại");
    }
  });
  return { mutate, isLoading };
};
export default useaddproductadmin;
