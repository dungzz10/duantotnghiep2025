import agent from "../agent";

export const loadAdmin = async () => {
  try {
    console.log("loadAdmin");
    const res = await agent.Admin.loadAdmin();
    console.log("loadAdmin 2");
    //   console.log("API Response:", res);
    //   console.log(res.data);
    console.log("data", res);
    return res.admin; // Trả về dữ liệu
  } catch (error) {
    console.error("Error in loadAdmin:", error);
    throw error; // Để React Query xử lý lỗi
  }
};
