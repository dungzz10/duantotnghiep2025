import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUserApi } from "../api/logoutUserApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
export const userLogout = () => { 
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: Logout } = useMutation({
    mutationFn: logoutUserApi, // 
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
   
     
      queryClient.resetQueries(["user"]);
      localStorage.removeItem("token");
      navigate("/"); // 
      console.log("Logout Success:", data);
      
      if (data?.success) {
        toast.success(data.message);
      }
    },
  });

  return { Logout }; 
};
