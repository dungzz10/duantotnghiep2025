import agent from "../agent"
export const logoutAdminApi = async () => {
    try {
       return await agent.Admin.logoutAdmin();
    //    console.log("Logout Success:", res);
    //    return res;
        
    } catch (error) {
        throw error;
        
    }

}