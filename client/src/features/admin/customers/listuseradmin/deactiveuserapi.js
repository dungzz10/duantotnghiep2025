import agent from "../../../../app/agent";
const deactiveuserapi = async (id) => {
  try {
    return await agent.Account.deactiveUser(id);
  } catch (error) {
    throw error;
  }
};
export default deactiveuserapi
