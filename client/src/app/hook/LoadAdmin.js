import { useQuery } from "@tanstack/react-query";
import { loadAdmin } from "../api/loadAdminapi"; // Đảm bảo rằng bạn đã định nghĩa API loadAdmin

export const useAdmin = () => {
  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin"],
    queryFn: async () => await loadAdmin(), // Gọi API loadAdmin từ agent
  });

  return { admin, isLoading };
};
