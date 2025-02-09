import { useMutation } from "@tanstack/react-query"; // Đảm bảo import đúng

import { message } from "antd";
import { forgotPasswordApi } from "./forgotpasswordApi.js";
import { toast } from "react-toastify";

export const useforgotpassword = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // console.log("email:2", email);
  const { mutate: forgotpassword, isLoading } = useMutation({
    mutationFn: (data) => forgotPasswordApi(data),

    onSuccess: (data) => {
      console.log("data", data);
      messageApi.success(data.message);
      toast.success(data.message);
    },
  });

  return { forgotpassword, isLoading,contextHolder };
};
