import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [isOpen, setIsOpen] = useState(false);

  // Apply search filter
  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilterProducts(productsCopy);
  };

  // Sort products
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const sortOptions = [
    { value: 'relevant', label: 'Relevant' },
    { value: 'low-high', label: 'Low to High' },
    { value: 'high-low', label: 'High to Low' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-14 max-w-7xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 sm:gap-8 mb-8 sm:mb-10"
        variants={itemVariants}
      >
        <div className="flex-1">
          <Title text1="ALL" text2="EARRINGS" />
          <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-600 font-light">
            Discover elegant earrings designed to elevate your style.
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-full sm:w-auto sm:min-w-[180px]">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:border-gray-900 transition-all bg-white"
          >
            <span className="flex items-center gap-2">
              <FiChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              Sort
            </span>
          </button>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortType(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                    sortType === option.value
                      ? 'bg-black text-white font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Products Grid */}
      {filterProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4"
          variants={containerVariants}
        >
          {filterProducts.map((item, index) => (
            <motion.div
              key={item._id}
              custom={index}
              variants={itemVariants}
              className="flex justify-center"
            >
              <ProductItem
                name={item.name}
                id={item._id}
                price={item.price}
                image={item.image}
                rating={item.rating}
                reviews={item.reviews}
                bestseller={item.bestseller}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          className="text-center py-16 sm:py-20"
          variants={itemVariants}
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <p className="text-base sm:text-lg font-medium text-gray-900">No products found</p>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 font-light">
            Try adjusting your search or filters.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Collection;