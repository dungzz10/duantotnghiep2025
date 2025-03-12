import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Input, Select } from 'antd';
import useFetchData from '../../app/api/useFetchdata';

const { Option } = Select;

const CategoriesPage = () => {
  const { id } = useParams();
  const [priceRange, setPriceRange] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: categories, isLoading, error } = useFetchData(`categories/${id}`);

  // Loading states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error.message}</div>;
  }

  // Set filtered products based on categories
  useEffect(() => {
    if (categories && categories.products) {
      setFilteredProducts(categories.products);
    }
  }, [categories]);

  // Filter products based on price range
  useEffect(() => {
    if (categories && categories.products) {
      let products = [...categories.products];

      if (priceRange) {
        products = products.filter(product => {
          if (priceRange === 'under1m') return product.originalPrice < 1000000;
          if (priceRange === '1mTo2m') return product.originalPrice >= 1000000 && product.originalPrice <= 2000000;
          if (priceRange === '2mTo3m') return product.originalPrice >= 2000000 && product.originalPrice <= 3000000;
          if (priceRange === '3mTo5m') return product.originalPrice >= 3000000 && product.originalPrice <= 5000000;
          return true;
        });
      }

      setFilteredProducts(products);
    }
  }, [priceRange, categories]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-6">{categories?.title}</h1>
      <div className="flex gap-4">
        {/* Thanh lọc giá */}
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-semibold mb-4">Lọc theo giá</h2>
          <ul>
            <li>
              <input type="radio" name="price" value="under1m" onChange={() => setPriceRange('under1m')} /> Dưới 1.000.000₫
            </li>
            <li>
              <input type="radio" name="price" value="1mTo2m" onChange={() => setPriceRange('1mTo2m')} /> 1.000.000₫ - 2.000.000₫
            </li>
            <li>
              <input type="radio" name="price" value="2mTo3m" onChange={() => setPriceRange('2mTo3m')} /> 2.000.000₫ - 3.000.000₫
            </li>
            <li>
              <input type="radio" name="price" value="3mTo5m" onChange={() => setPriceRange('3mTo5m')} /> 3.000.000₫ - 5.000.000₫
            </li>
          </ul>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product._id} to={'/san-pham/' + product._id} className="group p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={product.image[0].url}
                  alt={product.title}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm font-semibold text-gray-800">{product.title}</h3>
                <div className="flex products-center mt-1">
                  <>
                    <p className="text-lg font-medium text-red-600 mr-2">${product.originalPrice}</p>
                    <p className="text-sm font-medium text-gray-500 line-through">${product.salePrice}</p>
                  </>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-full">Không có sản phẩm nào phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;