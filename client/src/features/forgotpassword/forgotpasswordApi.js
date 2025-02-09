import agent from "../../app/agent";
export const forgotPasswordApi = async (body) => {
  // console.log("body", body);
  try {
   return await agent.Account.forgotPassword(body);
  //  console.log("Forgot Password Success:", res);
 

  } catch (error) {
    throw error;
  }
};
