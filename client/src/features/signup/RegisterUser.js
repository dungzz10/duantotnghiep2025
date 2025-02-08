import { useMutation } from "@tanstack/react-query";
import { registerUserApi } from "./RegisterUserApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export const userRegister = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => registerUserApi(data),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/signin");
    },
  });
};
