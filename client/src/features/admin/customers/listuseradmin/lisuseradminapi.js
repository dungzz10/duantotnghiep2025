import agent from "../../../../app/agent";
export const listUserAdminApi = async () => {
  try {
    return await agent.Admin.getAllUser();
  } catch (error) {
    throw error;
  }
};
