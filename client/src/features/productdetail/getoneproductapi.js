 import agent from "../../app/agent"
 const getOneProductapi = async (productId) => {
    try {
        return await agent.Product.getOneProduct(productId);
        
    } catch (error) {
        console.error( error);
        throw error;
        
    }
 }
 export default getOneProductapi;