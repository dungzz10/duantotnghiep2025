import { useMutation } from "@tanstack/react-query";
import { profileApi, uppdatePasswordApi } from "./profileApi";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";
export const useProfileApi = () => {
  const queryClient = useQueryClient();
  const { mutate: uppdateMe, isLoading } = useMutation({
    mutationFn: async (data) => await profileApi(data),
    onSuccess: () => {
      message.success("Data cap nhat thanh cong");
      queryClient.invalidateQueries[{ queryKey: ["user"] }];
    },
  });
  return { uppdateMe, isLoading };
};
export const useUppdatePasswordApi = () => {
  const queryClient = useQueryClient();
  const { mutate: uppdatePass, isLoading: isLoadingPass } = useMutation({
    mutationFn: async (data) => await uppdatePasswordApi(data),
    onSuccess: (data) => {
      message.success("Data cap nhat thanh cong");
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries[{ queryKey: ["user"] }];
    },
  });
  return { uppdatePass, isLoadingPass };
};
