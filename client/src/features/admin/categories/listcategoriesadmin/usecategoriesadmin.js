import { useQuery } from "@tanstack/react-query";
import { listCategoriesAdminApi } from "./listcategoriesadminapi";
export const useCategoriesAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => await listCategoriesAdminApi(),
  });
  return { data, isLoading };
};
