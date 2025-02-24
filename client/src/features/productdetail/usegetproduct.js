import { useQuery } from "@tanstack/react-query";
import getOneProductapi from "./getoneproductapi";

const useGetOneProduct = (id) => {
  const { data, isLoading ,error} = useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      return await getOneProductapi(id);
    },
  });

  return { data, isLoading ,error};
};

export default useGetOneProduct;
