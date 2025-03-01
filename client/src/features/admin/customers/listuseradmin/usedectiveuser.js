import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import deactiveuserapi from "./deactiveuserapi";

const usedeactiveuser = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: async (id) => await deactiveuserapi(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
      message.success("Cập nhật trạng thái người dùng thành công");
    },
    onError: (error) => {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái người dùng");
    }
  });

  return { mutate, isLoading };
};

export default usedeactiveuser;
