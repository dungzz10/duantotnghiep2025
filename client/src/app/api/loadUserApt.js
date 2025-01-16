import agent from "../agent";

export const loadUser = async () => {
    try {
      const res = await agent.Account.loadUser();
    //   console.log("API Response:", res);
    //   console.log(res.data);
      return res.user; // Trả về dữ liệu
    } catch (error) {
      console.error("Error in loadUser:", error);
      throw error; // Để React Query xử lý lỗi
    }
  };
  