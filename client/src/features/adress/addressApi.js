import agent from "../../app/agent";
export const getAddressApi = async () => {
  try {
    return await agent.Account.myAddress();
  } catch (error) {
    throw error;
  }
};
export const addAdressApi = async (data) => {
  try {
    return await agent.Account.addAdress(data);
  } catch (error) {
    throw error;
  }
};
export const uppdateAdressApi = async (data) => {
  console.log(data)
  try {
    return await agent.Account.uppdateAdress(data);
  } catch (error) {
    throw error;
  }
};
export const deleteAddressApi = async (id) => {
  try {
    return await agent.Account.deleteAdress(id);
  } catch (error) {
    throw error;
  }
};
