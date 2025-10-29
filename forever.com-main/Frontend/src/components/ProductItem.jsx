import React, { useContext, useState, memo } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = memo(({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Wishlist clicked for product:", id);
    // wishlist logic here
  };

  return (
    <div className="relative group w-full">
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-3 right-3 z-20 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition"
        aria-label="Add to wishlist"
      >
        <svg
          className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      </button>

      <Link
        to={`/product/${id}`}
        className="block relative z-10"
        aria-label={`View ${name} - ${currency}${formattedPrice}`}
      >
        <article className="bg-white rounded-2xl overflow-hidden transition-all duration-500 border border-gray-100 hover:border-gray-200">
          {/* Image Section */}
          <div className="relative aspect-[4/4.5] overflow-hidden bg-gray-50">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
            )}

            {!imageError ? (
              <img
                src={image?.[0] || "/placeholder-image.jpg"}
                alt={name}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                className={`w-full h-full object-cover transition-all duration-700 ease-out 
                  ${imageLoaded ? "opacity-100" : "opacity-0"} 
                  group-hover:scale-105`}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100">
                <svg
                  className="w-12 h-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}

            {/* Subtle gradient overlay for elegant depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 space-y-2">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-gray-700 transition-colors duration-300">
              {name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-gray-900">
                <span className="text-sm align-top">{currency}</span>
                {formattedPrice}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <span>View Details</span>
              <svg
                className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
});

ProductItem.displayName = "ProductItem";
export default ProductItem;
