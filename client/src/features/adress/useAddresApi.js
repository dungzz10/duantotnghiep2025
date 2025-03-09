import { getAddressApi } from "./addressApi";
import { useQuery } from "@tanstack/react-query";
export const getAddress = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await getAddressApi(),
  });
  return {data,isLoading}
};
