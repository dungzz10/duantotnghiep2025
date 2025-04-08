import { useMutation } from "@tanstack/react-query";
import { registerUserApi } from "./RegisterUserApi";
import toast from "react-hot-toast";
export const userRegister = () => {
  return useMutation({
    mutationFn: (data) => registerUserApi(data),
    onSuccess: (data) => {
      toast.success(data.message);
    },
  });
};
