import agent from "../../app/agent"
export const getAddressApi = async ()=>{
    try {
        return await agent.Account.myAddress()
        
    } catch (error) {
        throw error
        
    }

}