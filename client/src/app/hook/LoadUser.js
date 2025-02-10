import { useQuery } from "@tanstack/react-query";
import { loadUser } from "../api/loadUserApt";

export const useUser = () => {
  const { data: user, isLoading } = useQuery({
    
    queryKey: ["user"],
    queryFn: async () => await loadUser(),
  });

  return { user, isLoading };
};
