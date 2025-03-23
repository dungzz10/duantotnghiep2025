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
export const getWalletApi = async () => {
  try {
    return await agent.Account.getWallet();
  } catch (error) {
    throw error;
  }
};
export const naptienApi = async (data) => {
  console.log(data)
  try {
    return await agent.Account.naptien(data);
  } catch (error) {
    throw error;
  }
};
export const ruttienApi = async (data) => {
  try {
    return await agent.Account.ruttien(data);
  } catch (error) {
    throw error;
  }
}
