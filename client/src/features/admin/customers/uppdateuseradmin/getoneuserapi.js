import agent from "../../../../app/agent";
const getoneuserapi = async (userId) => {
  try {
    return await agent.Admin.getOneUser(userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default getoneuserapi;
