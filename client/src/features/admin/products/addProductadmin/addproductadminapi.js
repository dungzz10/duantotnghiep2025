import agent from "../../../../app/agent";
const addproductAdminApi = async (body) => {
  try {
    return await agent.Admin.addProduct(body);
  } catch (error) {
    throw error;
  }
};
export default addproductAdminApi;
