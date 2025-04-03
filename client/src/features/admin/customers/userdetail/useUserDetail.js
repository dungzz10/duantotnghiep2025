import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getBaseUrl } from "../../../../utils/baseURL";

export const useUserDetail = (userId) => {
  return useQuery({
    queryKey: ["userDetail", userId],
    queryFn: async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/api/v1/user/khachhang/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || "Có lỗi xảy ra");
      }
    },
    enabled: !!userId,
  });
};