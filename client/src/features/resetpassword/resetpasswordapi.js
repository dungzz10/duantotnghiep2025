import agent from "../../app/agent";

export const resetPasswordApi = async (body) => {
  try {
    return await agent.Account.resetPassword(body);
  } catch (error) {
    throw error;
  }
};