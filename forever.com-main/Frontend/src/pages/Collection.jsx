import React, { useContext, useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import { FiChevronDown, FiSearch } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const sortRef = useRef(null);
  const dropdownRef = useRef(null);
  const gridRef = useRef(null);
  const itemsRef = useRef([]);
  const emptyRef = useRef(null);

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

  // Initial page animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([titleRef.current, descRef.current, sortRef.current], {
        opacity: 0,
        y: 20,
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.3 // Small delay to ensure navbar loads first
      });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      })
      .to(descRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, "-=0.4")
      .to(sortRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, "-=0.3");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate products grid
  useEffect(() => {
    if (filterProducts.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(itemsRef.current, {
        opacity: 0,
        y: 30,
      });

      gsap.to(itemsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
      });

    }, gridRef);

    return () => ctx.revert();
  }, [filterProducts]);

  // Dropdown animation
  useEffect(() => {
    if (!dropdownRef.current) return;

    if (isOpen) {
      gsap.set(dropdownRef.current, {
        opacity: 0,
        y: -10,
        display: 'block',
      });

      gsap.to(dropdownRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(dropdownRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          if (dropdownRef.current) {
            gsap.set(dropdownRef.current, { display: 'none' });
          }
        }
      });
    }
  }, [isOpen]);

  // Empty state animation
  useEffect(() => {
    if (filterProducts.length === 0 && emptyRef.current) {
      gsap.fromTo(emptyRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [filterProducts]);

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

  return (
    <div 
      ref={containerRef}
      className="pt-24 lg:pt-28" // Account for fixed navbar
    >
      <div className="px-6 lg:px-16 xl:px-24 py-8 lg:py-12 max-w-[1800px] mx-auto">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12 lg:mb-16"
        >
          <div className="flex-1">
            <div ref={titleRef}>
              <Title text1="ALL" text2="COLLECTION" />
            </div>
            <p 
              ref={descRef}
              className="mt-3 text-sm lg:text-base text-gray-500 font-light tracking-wide max-w-2xl"
            >
              Discover elegant pieces designed to elevate your style.
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full sm:w-auto sm:min-w-[200px]">
            <button
              ref={sortRef}
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between gap-3 px-5 py-3 border border-gray-300 text-sm font-medium text-black hover:border-black transition-colors bg-white"
            >
              <span className="uppercase tracking-[0.1em] text-xs">
                {sortOptions.find(opt => opt.value === sortType)?.label}
              </span>
              <FiChevronDown 
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
              />
            </button>

            <div
              ref={dropdownRef}
              className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-200 shadow-lg z-20 hidden"
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortType(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-xs uppercase tracking-[0.1em] transition-colors ${
                    sortType === option.value
                      ? 'bg-black text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filterProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8"
          >
            {filterProducts.map((item, index) => (
              <div
                key={item._id}
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <ProductItem
                  name={item.name}
                  id={item._id}
                  price={item.price}
                  image={item.image}
                />
              </div>
            ))}
          </div>
        ) : (
          <div 
            ref={emptyRef}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-50 rounded-full">
                <FiSearch className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <p className="text-lg font-medium text-black mb-2">No products found</p>
            <p className="text-sm text-gray-500 font-light tracking-wide">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;