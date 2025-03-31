import { useMutation } from "@tanstack/react-query";
import loginApi from "./loginApi";
import { loginWithGoogle } from "./loginApi";
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
export const useGoogleLogin = () => {
  const { mutate: googleLogin, isLoading: isGoogleLoading } = useMutation({
    mutationFn: async () => {
      return await loginWithGoogle();
    },
    onSuccess: (data) => {
      console.log("Google login success:", data);
    },
    onError: (error) => {
      console.log("Google login error:", error);
    },
  });
  return { googleLogin, isGoogleLoading };
};