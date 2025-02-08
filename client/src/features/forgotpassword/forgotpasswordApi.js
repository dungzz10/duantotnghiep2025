import agent from "../../app/agent";
export const forgotPasswordApi = async (body) => {
  // console.log("body", body);
  try {
   const res= await agent.Account.forgotPassword(body);
   return res;

  } catch (error) {
    throw error;
  }
};
