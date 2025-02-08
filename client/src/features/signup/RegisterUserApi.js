import agent from "../../app/agent";
export const registerUserApi = async (data) => {
  try {
    return await agent.Account.register(data);
  } catch (error) {
    throw error;
  }
};
