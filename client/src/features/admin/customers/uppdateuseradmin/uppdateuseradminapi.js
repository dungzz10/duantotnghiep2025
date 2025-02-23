import agent from "../../../../app/agent";
const uppdateuseradminapi = async (userId, body) => {
  try {
    return await agent.Admin.uppdateUser(userId, body);
  } catch (error) {
    throw error;
  }
};
export default uppdateuseradminapi;
