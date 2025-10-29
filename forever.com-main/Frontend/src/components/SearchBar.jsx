import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();

  // Show search only on /collection page
  useEffect(() => {
    setVisible(location.pathname === '/collection'); // exact match
  }, [location]);

  // Filter suggestions
  useEffect(() => {
    if (!search.trim() || !products || products.length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = products
      .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);

    setSuggestions(filtered);
  }, [search, products]);

  const handleSuggestionClick = (name) => {
    setSearch(name);
    setSuggestions([]);
    setShowSearch(false);
  };

  return (
    <>
      {/* Animated Search Bar */}
      <AnimatePresence>
        {showSearch && visible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-50 flex flex-col items-center bg-white/90 backdrop-blur-md shadow-md py-4"
          >
            <div className="relative w-11/12 sm:w-1/2">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              />
              {/* Close Button */}
              <button
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-2.5 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              >
                <img src={assets.cross_icon} alt="Close" className="w-3 sm:w-4" />
              </button>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {suggestions.map((item) => (
                    <li
                      key={item._id}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      {item.name}
                    </li>
                  ))}
                </motion.ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
