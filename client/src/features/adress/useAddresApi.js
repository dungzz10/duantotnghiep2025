import {
  addAdressApi,
  getAddressApi,
  uppdateAdressApi,
  deleteAddressApi,
} from "./addressApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message } from "antd";
import { useQueryClient } from "@tanstack/react-query";

export const getAddress = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-addresses"],
    queryFn: async () => await getAddressApi(),
  });

  return { data, isLoading, refetch };
};

export const addAdress = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ data }) => await addAdressApi(data),
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
  return { mutate, isLoading };
};

export const uppdateAdress = () => {
  const queryClient = useQueryClient();
  const { mutate: uppdate, isLoading } = useMutation({
    mutationFn: async ({ data }) => await uppdateAdressApi(data),
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
  return { uppdate, isLoading };
};

export const deleteAdress = () => {
  const queryClient = useQueryClient();
  const { mutate: deletee, isLoading } = useMutation({
    mutationFn: async (id) => await deleteAddressApi(id),
    onSuccess: (data) => {
      message.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["user-addresses"] });
    },
  });
  return { deletee, isLoading };
};