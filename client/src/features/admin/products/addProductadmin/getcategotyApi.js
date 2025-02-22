import agent from "../../../../app/agent";
const getcategotyApi = async () => {
    try {
        return await agent.Category.getAllCategory();
        
    } catch (error) {
        throw error;
        
    }
}
export default getcategotyApi;