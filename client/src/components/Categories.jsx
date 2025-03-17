import React from "react";
import { useQuery } from "@tanstack/react-query";
import agent from "../app/agent";
import { useNavigate } from "react-router-dom";
const CategoryList = () => {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => agent.Categories.getAllCategories(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Handle the case when data structure is different than expected
  const categories = data?.data || data || [];
  

  console.log("Categories data structure:", data.data);

  return (
    <div className="section">
      <div className="shadow-lg rounded-lg flex flex-wrap p-6 gap-6 800px:gap-16">
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category) => (
            <div key={category._id || category.id} className="flex items-center gap-4 cursor-pointer">
              <p>{category.name}</p>
              <img
                className="w-[70px] 800px:w-[120px]"
                src={category.image}
                alt={category.name}
                onClick={() => navigate(`/danh-muc/${category._id}`)} 
              />
            </div>
          ))
        ) : (
          <div>No categories found</div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;