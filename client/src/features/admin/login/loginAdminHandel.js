import { useMutation } from "@tanstack/react-query";
import loginAdminApi from "./loginAdminApi";
export const useLoginAdmin = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async (data) => {
      // console.log("abc",data);
      return await loginAdminApi(data);
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

export default useLoginAdmin;
