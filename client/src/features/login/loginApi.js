import agent from "../../app/agent";

const loginApi = async (data) => {
  try {
    const res = await agent.Account.login(data);
    return res;
  } catch (error) {
    console.log("eerr", error);

    throw error;
  }
};
export default loginApi;
