import { useMutation } from "@tanstack/react-query";
import loginApi from "./loginApi";

export const useLogin = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      return await loginApi(data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return { mutate, isLoading };
};
;