import agent from "../agent"
export const logoutUserApi = async () => {
    try {
        await agent.Account.logout();
        
    } catch (error) {
        throw error;
        
    }

}