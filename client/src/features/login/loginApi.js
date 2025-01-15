import agent from "../../app/agent";
import axios from "axios";
const loginApi = async (data) => {
  try {
    const res = await agent.Account.login(data);
    return res;
  } catch (error) {
    console.log( error);
    throw error
   
  }
};
export default loginApi;
