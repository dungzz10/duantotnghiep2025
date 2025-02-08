import { useMutation } from "@tanstack/react-query"; // Đảm bảo import đúng
import { message } from "antd";
import { forgotPasswordApi } from "./forgotpasswordApi.js";

export const useforgotpassword = () => {
  // console.log("email:2", email);
  const { mutate: forgotpassword, isLoading } = useMutation({
    mutationFn: (data) => forgotPasswordApi(data),

    onSuccess: (data) => {
      console.log("data", data);  
      toast.success(data.message);
    },
  });

  return { forgotpassword, isLoading };
};
