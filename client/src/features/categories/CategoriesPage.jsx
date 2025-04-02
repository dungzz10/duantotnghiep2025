import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFetchData from '../../app/api/useFetchdata';
import RatingStarts from '../../components/RatingStarts';
import { getTotalReviewsByProduct } from '../reviews/useReview';

const CategoriesPage = () => {
  const { id } = useParams();
  const [priceRanges, setPriceRanges] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { data: categories, isLoading, error } = useFetchData(`categories/${id}`);
  const [totalReviews, setTotalReviews] = useState({});

  useEffect(() => {
    if (categories && categories.products) {
      setFilteredProducts(categories.products);
      
      // Fetch total reviews for each product
      const fetchReviews = async () => {
        const reviewsData = {};
        for (const product of categories.products) {
          const total = await getTotalReviewsByProduct(product._id);
          reviewsData[product._id] = total;
        }
        setTotalReviews(reviewsData);
      };
      
      fetchReviews();
    }
  }, [categories]);

  useEffect(() => {
    if (categories && categories.products) {
      let products = [...categories.products];

      // Filter by price ranges
      if (priceRanges.length > 0) {
        products = products.filter(product => {
          const finalPrice = product.originalPrice - product.salePrice;
          return priceRanges.some(range => {
            if (range === 'under1m') return finalPrice < 1000000;
            if (range === '1mTo2m') return finalPrice >= 1000000 && finalPrice <= 2000000;
            if (range === '2mTo3m') return finalPrice >= 2000000 && finalPrice <= 3000000;
            if (range === '3mTo5m') return finalPrice >= 3000000 && finalPrice <= 5000000;
            if (range === '>5m') return finalPrice >= 5000000
            return false;
          });
        });
      }

      // Filter by size
      if (selectedSizes.length > 0) {
        products = products.filter(product =>
          product.variants.some(variant =>
            variant.sizes.some(size => selectedSizes.includes(size.size))
          )
        );
      }
      
      // Filter by brand
      if (selectedBrands.length > 0) {
        products = products.filter(product => 
          selectedBrands.includes(product.brand)
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

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  // Extract unique sizes from all products
  const getAllSizes = () => {
    if (!categories || !categories.products) return [];
    const allSizes = new Set();
    categories.products.forEach(product => {
      product.variants?.forEach(variant => {
        variant.sizes?.forEach(size => {
          allSizes.add(size.size);
        });
      });
    });
    return Array.from(allSizes);
  };

  // Extract unique brands from all products
  const getAllBrands = () => {
    if (!categories || !categories.products) return [];
    const brands = new Set();
    categories.products.forEach(product => {
      if (product.brand) brands.add(product.brand);
    });
    return Array.from(brands);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">Error loading categories: {error.message}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-8">{categories?.title}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5 p-5 bg-white rounded-lg shadow-sm sticky top-4 h-fit">
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Lọc theo giá</h2>
          <ul className="space-y-2 mb-6">
            {['under1m', '1mTo2m', '2mTo3m', '3mTo5m', '>5m'].map(range => (
              <li key={range} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`price-${range}`}
                  checked={priceRanges.includes(range)} 
                  onChange={() => togglePriceRange(range)} 
                  className="mr-3 w-4 h-4 accent-blue-600"
                />
                <label htmlFor={`price-${range}`} className="text-gray-700 cursor-pointer">
                  {range === 'under1m' ? 'Dưới 1.000.000₫' : 
                   (range === '1mTo2m' ? '1.000.000₫ - 2.000.000₫' : 
                   (range === '2mTo3m' ? '2.000.000₫ - 3.000.000₫' : 
                   (range === '3mTo5m' ? '3.000.000₫ - 5.000.000₫' : 
                   'Trên 5.000.000₫')))}
                </label>
              </li>
            ))}
          </ul>
          
          {/* Size Filter */}
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Kích thước</h2>
          <ul className="space-y-2 mb-6">
            {getAllSizes().map(size => (
              <li key={size} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`size-${size}`}
                  checked={selectedSizes.includes(size)} 
                  onChange={() => toggleSize(size)} 
                  className="mr-3 w-4 h-4 accent-blue-600"
                />
                <label htmlFor={`size-${size}`} className="text-gray-700 cursor-pointer">{size}</label>
              </li>
            ))}
          </ul>
          
          {/* Brand Filter */}
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-200">Thương hiệu</h2>
          <ul className="space-y-2">
            {getAllBrands().map(brand => (
              <li key={brand} className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)} 
                  onChange={() => toggleBrand(brand)} 
                  className="mr-3 w-4 h-4 accent-blue-600"
                />
                <label htmlFor={`brand-${brand}`} className="text-gray-700 cursor-pointer">{brand}</label>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Product List */}
        <div className="w-full md:w-3/4 lg:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-5">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`}
                className="bg-white overflow-hidden cursor-pointer relative border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative overflow-hidden">
                  {product.status && (
                    <div className={`absolute top-4 left-0 ${
                      product.status === "sale" ? "bg-red-500" : 
                      product.status === "new" ? "bg-green-500" : 
                      product.status === "sold out" ? "bg-gray-600" : "bg-blue-500"
                    } text-white text-sm font-bold px-6 py-1 z-10 uppercase`}>
                      {product.status}
                    </div>
                  )}
                  <img
                    className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                    src={product.image?.[0]?.url || "https://via.placeholder.com/500"}
                    alt={product.title}
                  />
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-medium mb-1">{product.title}</h2>
                  <div className="text-gray-500 text-sm mb-3">{product.brand}</div>
                  
                  <div className="flex items-center mb-2">
                    <p className="mr-3 text-lg font-bold">
                      {(product.originalPrice - product.salePrice).toLocaleString()} đ
                    </p>
                    {product.salePrice > 0 && (
                      <p className="text-sm font-medium line-through text-gray-400">
                        {product.originalPrice.toLocaleString()} đ
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <RatingStarts rating={product.rating} />
                    <span className="text-sm text-gray-500 ml-2">({totalReviews[product._id] || 0})</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center col-span-full p-8 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 text-lg">Không có sản phẩm nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;