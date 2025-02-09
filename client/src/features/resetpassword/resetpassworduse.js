import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "./resetpasswordapi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();

  const { mutate: resetPass, isLoading } = useMutation({
    mutationFn: (data) => resetPasswordApi(data),
   
    onSuccess: (data) => {
      console.log("data", data);
      localStorage.setItem("tokenresetpass", data.token);
      toast.success(data.message);
      navigate("/"); // Chuyển hướng sau khi thành công
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Reset password failed");
    },
  });

  return { resetPass, isLoading };
};
