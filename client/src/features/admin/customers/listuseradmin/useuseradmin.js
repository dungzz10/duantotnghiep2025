import { listUserAdminApi } from "./lisuseradminapi";
import { useQuery } from "@tanstack/react-query";
export const useUserAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await listUserAdminApi(),
  });
  return { data, isLoading };
};
