import { useQuery } from "@tanstack/react-query";

import getcategotyApi from "./getcategotyApi";
const useCategory = () => {
  const { data: category, isLoading: loading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => await getcategotyApi(),
  });
  return { category, loading };
};
export default useCategory;
