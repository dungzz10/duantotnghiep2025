import agent from "../agent"
export const logoutUserApi = async () => {
    try {
       return await agent.Account.logout();
    //    console.log("Logout Success:", res);
    //    return res;
        
    } catch (error) {
        throw error;
        
    }

}