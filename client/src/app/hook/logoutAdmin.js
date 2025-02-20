import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutAdminApi } from "../api/logoutAdminApi"; // Đảm bảo bạn có định nghĩa API logoutAdmin
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const adminLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: Logout } = useMutation({
    mutationFn: logoutAdminApi, // Gọi API logoutAdmin
    onSuccess: (data) => {
      queryClient.invalidateQueries(["admin"]);
      queryClient.resetQueries(["admin"]);
      localStorage.removeItem("token");
      navigate("/admin/login"); // Chuyển hướng đến trang login admin
      console.log("Logout Admin Success:", data);
      
      if (data?.success) {
        toast.success(data.message);
      }
    },
  });

  return { Logout };
};
