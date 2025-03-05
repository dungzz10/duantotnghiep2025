import agent from "../../app/agent";
export const profileApi = async (data) => {
  try {
    return await agent.Account.uppdateMe(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const uppdatePasswordApi = async (data) => {
  try {
    return await agent.Account.uppdatePassword(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
