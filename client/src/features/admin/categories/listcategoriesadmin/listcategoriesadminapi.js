import agent from "../../../../app/agent";
export const listCategoriesAdminApi = async () => {
  try {
    return await agent.Categories.getAllCategories();
  } catch (error) {
    throw error;
  }
};

export const RemoveCategoriesAdminApi = async () => {
  try {
    return await agent.Categories.RemoveCategory();
  } catch (error) {
    throw error;
  }
};
