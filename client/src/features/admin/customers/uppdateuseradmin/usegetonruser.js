import { useQuery } from "@tanstack/react-query";
import getoneuserapi from "./getoneuserapi";

const useGetOneUser = (userId) => {
  const { data, isLoading } = useQuery({
    queryKey: ["user", userId], 
    queryFn: async () => await getoneuserapi(userId), 
  });
  return { data, isLoading };
};

export default useGetOneUser;
