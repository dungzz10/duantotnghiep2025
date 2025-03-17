import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetchData from '../../app/api/useFetchdata';

const CategoriesPage = () => {
  const { id } = useParams();
  const [priceRanges, setPriceRanges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: categories, isLoading, error } = useFetchData(`categories/${id}`);

  useEffect(() => {
    if (categories && categories.products) {
      setFilteredProducts(categories.products);
    }
  }, [categories]);

  useEffect(() => {
    if (categories && categories.products) {
      let products = [...categories.products];

      // Filter by price ranges
      if (priceRanges.length > 0) {
        products = products.filter(product => 
          priceRanges.some(range => {
            if (range === 'under1m') return product.originalPrice < 1000000;
            if (range === '1mTo2m') return product.originalPrice >= 1000000 && product.originalPrice <= 2000000;
            if (range === '2mTo3m') return product.originalPrice >= 2000000 && product.originalPrice <= 3000000;
            if (range === '3mTo5m') return product.originalPrice >= 3000000 && product.originalPrice <= 5000000;
            return false;
          })
        );
      }

      // Filter by size
      if (selectedSizes.length > 0) {
        products = products.filter(product =>
          product.variants.some(variant =>
            variant.sizes.some(size => selectedSizes.includes(size.size))
          )
        );
      }
      setFilteredProducts(products);
    }
  }, [priceRanges, selectedSizes, selectedBrands, categories]);

  const togglePriceRange = (range) => {
    setPriceRanges(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading categories: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">{categories?.title}</h1>
      <div className="flex gap-4">
        {/* Filter Sidebar */}
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Lọc theo giá</h2>
          <ul className="space-y-2">
            {['under1m', '1mTo2m', '2mTo3m', '3mTo5m'].map(range => (
              <li key={range}>
                <input 
                  type="checkbox" 
                  checked={priceRanges.includes(range)} 
                  onChange={() => togglePriceRange(range)} 
                />
                <label className="ml-2">{range === 'under1m' ? 'Dưới 1.000.000₫' : 
                 (range === '1mTo2m' ? '1.000.000₫ - 2.000.000₫' : 
                 (range === '2mTo3m' ? '2.000.000₫ - 3.000.000₫' : 
                 '3.000.000₫ - 5.000.000₫'))}</label>
              </li>
            ))}
          </ul>

          {/* Filter by Size */}
          <h2 className="text-xl font-semibold mt-4 mb-2">Kích thước</h2>
          <ul className="space-y-2">
            {[36, 37, 38, 39, 40, 41, 42, 43].map(size => (
              <li key={size}>
                <input 
                  type="checkbox" 
                  checked={selectedSizes.includes(size)} 
                  onChange={() => toggleSize(size)} 
                />
                <label className="ml-2">{size}</label>
              </li>
            ))}
          </ul>
        </div>
        {/* Product List */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`} 
                className="group p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <img
                  src={product.image[0].url}
                  alt={product.title}
                  className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8]"
                />
                <h3 className="mt-4 text-sm font-semibold text-gray-800">{product.title}</h3>
                <div className="flex items-center mt-1">
                  <p className="text-lg font-medium text-red-600 mr-2">{product.originalPrice.toLocaleString()}₫</p>
                  {product.salePrice > 0 && (
                    <p className="text-sm font-medium text-gray-500 line-through">{product.salePrice.toLocaleString()}₫</p>
                  )}
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