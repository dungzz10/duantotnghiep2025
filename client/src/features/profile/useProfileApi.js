import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getWalletApi,
  naptienApi,
  profileApi,
  ruttienApi,
  uppdatePasswordApi,
} from "./profileApi";
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

export const getWallet = () => {
  const { data, isLoading: isLoadingVi } = useQuery({
    queryKey: ["wallet"],
    queryFn: async () => getWalletApi(),
    onSuccess: () => {},
    onError: (error) => {
      console.error(error);
    },
  });

  return { data, isLoadingVi };
};

export const useNaptien = () => {
  const queryClient = useQueryClient();
  const { mutate: naptien, isLoading: isLoadingNap } = useMutation({
    mutationFn: async (data) => await naptienApi(data),
    onSuccess: (response) => {
      console.log(response)
      if (response && response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        message.success("Nạp tiền thành công");
        queryClient.invalidateQueries({ queryKey: ["user"] });
      }
    },
    onError: (error) => {
      message.error("Deposit failed");
      console.error("Deposit error:", error);
    },
  });

  return { naptien, isLoadingNap };
};
export const useRuttien = () => {
  const queryClient = useQueryClient();
  const { mutate: ruttien, isLoading: isLoadingRut } = useMutation({
    mutationFn: async (data) => await ruttienApi(data),
    onSuccess: (response) => {
      console.log(response)
      if (response && response.data.payUrl) {
        window.location.href = response.data.payUrl;
      } else {
        message.success("Rút TIền  thành công");
        queryClient.invalidateQueries({queryKey: ["user"]});
      }
    },
    onError: (error) => {
      // message.error("Deposit failed");
      console.error("Deposit error:", error);
    },
  });

  return { ruttien, isLoadingRut };
};

