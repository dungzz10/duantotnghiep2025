import agent from "../../../app/agent";
const loginAdminApi = async (data) => {
    try {
        const res = await agent.Admin.loginadmin(data);
        return res;
    } catch (error) {
        console.log("eerr", error);
        throw error;
    }


}
export default loginAdminApi;