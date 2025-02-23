import uppdateuseradminapi from "./uppdateuseradminapi";
import { useMutation } from "@tanstack/react-query";

const userupdateuser = () => {
  const { mutate, isLoading } = useMutation({
    mutationFn: async ({ userId, data }) => {  
      return await uppdateuseradminapi(userId, data);
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return { mutate, isLoading };
};

export default userupdateuser;
