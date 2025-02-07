import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutUserApi } from "../api/logoutUserApi";
import { useNavigate } from "react-router-dom";

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
      
      if (data?.success) {
        console.log("Logout Success:", data);
      }
    },
  });

  return { Logout }; 
};
